# Common Angular Patterns

## Data Service Patterns

### Pattern 1: Standard HTTP Service (Angular 11+)
```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }
  
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`/api/users/${id}`);
  }
  
  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>('/api/users', user);
  }
  
  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.patch<User>(`/api/users/${id}`, user);
  }
  
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`/api/users/${id}`);
  }
}
```

### Pattern 2: Reactive Service with RxJS (Angular 11+)
```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  
  // Public observable stream
  private users$ = new BehaviorSubject<User[]>([]);
  public users = this.users$.asObservable();
  
  // Action streams
  private loadUsers$ = new Subject<void>();
  
  constructor() {
    // Reactive pipeline
    this.loadUsers$
      .pipe(
        switchMap(() => this.http.get<User[]>('/api/users')),
        tap(users => this.users$.next(users)),
        catchError(error => {
          console.error('Failed to load users', error);
          return of([]);
        })
      )
      .subscribe();
  }
  
  loadUsers(): void {
    this.loadUsers$.next();
  }
  
  addUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>('/api/users', user).pipe(
      tap(newUser => {
        const current = this.users$.value;
        this.users$.next([...current, newUser]);
      })
    );
  }
}
```

### Pattern 3: Signals-based Service (Angular 16+)
```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  
  // Signal for state
  private users = signal<User[]>([]);
  private isLoading = signal(false);
  private error = signal<string | null>(null);
  
  // Computed for derived state
  userCount = computed(() => this.users().length);
  
  // Public accessors
  users$ = toObservable(this.users);
  isLoading$ = toObservable(this.isLoading);
  
  loadUsers(): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.http.get<User[]>('/api/users')
      .pipe(
        takeUntilDestroyed(),
        finalize(() => this.isLoading.set(false)),
        catchError(err => {
          this.error.set(err.message);
          return of([]);
        })
      )
      .subscribe(users => this.users.set(users));
  }
}
```

---

## Component Patterns

### Pattern 1: Traditional Class Component
```typescript
@Component({
  selector: 'app-user-list',
  template: `
    <div *ngIf="isLoading">Loading...</div>
    <div *ngIf="error" class="error">{{ error }}</div>
    <ul *ngIf="users">
      <li *ngFor="let user of users">{{ user.name }}</li>
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {
  users: User[] | null = null;
  isLoading = false;
  error: string | null = null;
  
  constructor(private userService: UserService) {}
  
  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: users => this.users = users,
      error: err => this.error = err.message,
      complete: () => this.isLoading = false
    });
  }
}
```

### Pattern 2: Reactive Component with Observable
```typescript
@Component({
  selector: 'app-user-list',
  template: `
    <div *ngIf="isLoading$ | async">Loading...</div>
    <div *ngIf="error$ | async as err" class="error">{{ err }}</div>
    <ul *ngIf="users$ | async as users">
      <li *ngFor="let user of users">{{ user.name }}</li>
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  users$ = this.userService.getUsers().pipe(
    catchError(err => of(null))
  );
  isLoading$ = this.users$.pipe(
    map(() => false),
    startWith(true)
  );
  error$ = this.users$.pipe(
    map(() => null),
    catchError(err => of(err.message))
  );
  
  constructor(private userService: UserService) {}
}
```

### Pattern 3: Standalone Component with Signals (Angular 14+)
```typescript
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isLoading()) {
      <div>Loading...</div>
    }
    @if (error()) {
      <div class="error">{{ error() }}</div>
    }
    @if (users(); as userList) {
      <ul>
        @for (user of userList; track user.id) {
          <li>{{ user.name }}</li>
        }
      </ul>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  
  users = signal<User[] | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  
  ngOnInit(): void {
    this.userService.getUsers()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: users => {
          this.users.set(users);
          this.isLoading.set(false);
        },
        error: err => {
          this.error.set(err.message);
          this.isLoading.set(false);
        }
      });
  }
}
```

---

## Testing Patterns

### Component Test
```typescript
describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: jasmine.SpyObj<UserService>;
  
  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers']);
    
    await TestBed.configureTestingModule({
      declarations: [UserListComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();
    
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
  });
  
  it('should load users on init', fakeAsync(() => {
    // Arrange
    const mockUsers = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' }
    ];
    userService.getUsers.and.returnValue(of(mockUsers));
    
    // Act
    fixture.detectChanges();
    tick();
    
    // Assert
    expect(component.users).toEqual(mockUsers);
    expect(userService.getUsers).toHaveBeenCalled();
  }));
  
  it('should handle errors gracefully', fakeAsync(() => {
    // Arrange
    userService.getUsers.and.returnValue(
      throwError(() => new Error('Network error'))
    );
    
    // Act
    fixture.detectChanges();
    tick();
    
    // Assert
    expect(component.error).toBe('Network error');
  }));
});
```

### Service Test
```typescript
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
    httpMock.verify();
  });
  
  it('should fetch users', () => {
    // Arrange
    const mockUsers: User[] = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' }
    ];
    
    // Act
    service.getUsers().subscribe(users => {
      // Assert
      expect(users).toEqual(mockUsers);
    });
    
    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
  
  it('should create user', () => {
    // Arrange
    const newUser = { name: 'Bob' };
    const expectedResponse = { id: 3, ...newUser };
    
    // Act
    service.createUser(newUser).subscribe(result => {
      // Assert
      expect(result).toEqual(expectedResponse);
    });
    
    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('POST');
    req.flush(expectedResponse);
  });
});
```

---

## State Management Pattern

### Simple State Management with Services
```typescript
@Injectable({ providedIn: 'root' })
export class AppStateService {
  private readonly initialState = {
    users: [],
    selectedUserId: null,
    isLoading: false,
    error: null
  };
  
  private state$ = new BehaviorSubject(this.initialState);
  
  // Selectors
  users$ = this.state$.pipe(map(s => s.users));
  isLoading$ = this.state$.pipe(map(s => s.isLoading));
  selectedUser$ = this.state$.pipe(
    map(s => s.users.find(u => u.id === s.selectedUserId))
  );
  
  constructor(private http: HttpClient) {}
  
  // Actions
  loadUsers(): void {
    this.setState({ isLoading: true });
    this.http.get<User[]>('/api/users')
      .pipe(
        finalize(() => this.setState({ isLoading: false })),
        catchError(err => {
          this.setState({ error: err.message });
          return of([]);
        })
      )
      .subscribe(users => this.setState({ users }));
  }
  
  selectUser(id: number): void {
    this.setState({ selectedUserId: id });
  }
  
  private setState(partial: Partial<typeof this.initialState>): void {
    const current = this.state$.value;
    this.state$.next({ ...current, ...partial });
  }
}
```

---

## Dependency Injection Pattern

### Provide Services in Module (Angular 11-13)
```typescript
@NgModule({
  declarations: [UserComponent],
  providers: [
    UserService,
    {
      provide: UserRepository,
      useClass: HttpUserRepository
    },
    {
      provide: LOGGER,
      useFactory: (env: Environment) => {
        return env.production ? new ConsoleLogger() : new DebugLogger();
      },
      deps: [Environment]
    }
  ]
})
export class UserModule {}
```

### Provide Services in Component (Angular 14+)
```typescript
@Component({
  selector: 'app-user',
  standalone: true,
  providers: [
    UserService,
    {
      provide: UserRepository,
      useClass: HttpUserRepository
    }
  ]
})
export class UserComponent {}
```

### Inject Pattern (Angular 14+)
```typescript
export class UserComponent {
  private userService = inject(UserService);
  private router = inject(Router);
  
  navigateToUser(id: number): void {
    this.userService.getUser(id).subscribe(user => {
      this.router.navigate(['/users', user.id]);
    });
  }
}
```

---

## RxJS Best Practices

### Memory Leak Prevention
```typescript
export class UserListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  users$ = this.userService.getUsers().pipe(
    takeUntil(this.destroy$)
  );
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// Or with takeUntilDestroyed (Angular 16+)
export class UserListComponent {
  users$ = this.userService.getUsers().pipe(
    takeUntilDestroyed()
  );
  
  constructor(private userService: UserService) {}
}
```

### Error Handling
```typescript
users$ = this.userService.getUsers().pipe(
  catchError(error => {
    console.error('Failed to load users:', error);
    return of([]); // Return fallback
  }),
  retry({ count: 3, delay: 1000 }) // Retry 3 times
);
```

### Combining Multiple Observables
```typescript
vm$ = combineLatest([
  this.userService.getUsers(),
  this.permissionService.getPermissions(),
  this.settingsService.getSettings()
]).pipe(
  map(([users, permissions, settings]) => ({
    users,
    permissions,
    settings
  }))
);
```
