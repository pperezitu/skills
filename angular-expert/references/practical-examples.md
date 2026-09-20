# Practical Examples

Real-world scenarios and how the angular-expert skill helps.

## Scenario 1: Creating a Product List Feature

### Request
"I need to create a product list component that fetches data from `/api/products`. The list should be sortable and filterable."

### Skill Response

**Step 1: Detect Context**
```
✓ Angular Version: 16
✓ Testing Framework: Jasmine
✓ Project Structure: Standalone components
✓ Available Features: Signals, Control Flow syntax
```

**Step 2: Propose Patterns**
```
A) Traditional Service + Component
   • Service: HttpClient-based with Observable
   • Component: OnPush with async pipe
   ✓ Simple and straightforward
   ✗ More boilerplate for filtering/sorting

B) Reactive Service + Component
   • Service: BehaviorSubject with RxJS operators
   • Component: Reactive with filter/sort streams
   ✓ Powerful state management
   ✗ More complex RxJS knowledge needed

C) Signals-based Service + Component
   • Service: Signals for product list, filter, sort
   • Component: Standalone with @for and @if
   ✓ Most modern, fine-grained reactivity
   ✗ Requires Angular 16+

Which approach would you prefer?
```

**Step 3: Code Generation (if user chooses C)**

```typescript
// product.service.ts
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly products = signal<Product[]>([]);
  private readonly sortBy = signal<'name' | 'price'>('name');
  private readonly filterText = signal('');
  
  filtered = computed(() => {
    const all = this.products();
    const search = this.filterText().toLowerCase();
    
    return all
      .filter(p => p.name.toLowerCase().includes(search))
      .sort((a, b) => {
        if (this.sortBy() === 'name') {
          return a.name.localeCompare(b.name);
        }
        return a.price - b.price;
      });
  });
  
  loadProducts(): void {
    this.http.get<Product[]>('/api/products')
      .pipe(takeUntilDestroyed())
      .subscribe(
        products => this.products.set(products),
        error => console.error('Failed to load products', error)
      );
  }
  
  setSortBy(sort: 'name' | 'price'): void {
    this.sortBy.set(sort);
  }
  
  setFilterText(text: string): void {
    this.filterText.set(text);
  }
}

// product-list.component.ts
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="controls">
      <input 
        #filterInput 
        (input)="service.setFilterText(filterInput.value)" 
        placeholder="Search products..."
      />
      <button (click)="service.setSortBy('name')">Sort by Name</button>
      <button (click)="service.setSortBy('price')">Sort by Price</button>
    </div>
    
    @if (service.filtered(); as products) {
      @if (products.length === 0) {
        <p>No products found</p>
      } @else {
        <ul>
          @for (product of products; track product.id) {
            <li>{{ product.name }} - \${{ product.price }}</li>
          }
        </ul>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {
  service = inject(ProductService);
  
  ngOnInit(): void {
    this.service.loadProducts();
  }
}
```

**Step 4: Testing**

```typescript
describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  it('should load products', () => {
    const mockProducts: Product[] = [
      { id: 1, name: 'Widget', price: 10 },
      { id: 2, name: 'Gadget', price: 20 }
    ];
    
    service.loadProducts();
    
    const req = httpMock.expectOne('/api/products');
    req.flush(mockProducts);
    
    expect(service.filtered()).toEqual(mockProducts);
  });
  
  it('should filter products by name', () => {
    // Arrange
    service.filtered.set([
      { id: 1, name: 'Widget', price: 10 },
      { id: 2, name: 'Gadget', price: 20 }
    ]);
    
    // Act
    service.setFilterText('widget');
    
    // Assert
    expect(service.filtered().length).toBe(1);
    expect(service.filtered()[0].name).toBe('Widget');
  });
});
```

---

## Scenario 2: Refactoring a Monolithic Component

### Request
"I have this huge UserDetailComponent that handles loading, displaying, editing, and saving user data. It's 300+ lines. Can you help me refactor it with SOLID principles?"

### Skill Response

**Step 1: Analyze**
- Component violates Single Responsibility Principle
- Needs separation: data loading, display, editing, form handling

**Step 2: Propose Architecture**

```
Current (❌ Bad):
UserDetailComponent (300+ lines)
  └─ httpClient.get()
  └─ httpClient.put()
  └─ Form handling
  └─ Display logic
  └─ Validation logic

Refactored (✓ Good):
UserDetailComponent (presentation only)
  └─ UserService (data management)
       └─ UserRepository (HTTP calls)
  └─ UserFormComponent (form handling)
  └─ UserValidationService (validation logic)
```

**Step 3: Generate Services**

```typescript
// user.repository.ts
@Injectable()
export class UserRepository {
  constructor(private http: HttpClient) {}
  
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`/api/users/${id}`);
  }
  
  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`/api/users/${id}`, user);
  }
}

// user.service.ts
@Injectable({ providedIn: 'root' })
export class UserService {
  private repo = inject(UserRepository);
  
  private user$ = new BehaviorSubject<User | null>(null);
  user = this.user$.asObservable();
  
  loadUser(id: number): void {
    this.repo.getUser(id)
      .pipe(
        tap(user => this.user$.next(user)),
        catchError(err => {
          console.error('Failed to load user', err);
          return of(null);
        })
      )
      .subscribe();
  }
  
  updateUser(id: number, changes: Partial<User>): Observable<User> {
    return this.repo.updateUser(id, changes).pipe(
      tap(updated => this.user$.next(updated))
    );
  }
}

// user-validation.service.ts
@Injectable({ providedIn: 'root' })
export class UserValidationService {
  validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  validateUsername(username: string): boolean {
    return username.length >= 3 && username.length <= 50;
  }
}
```

**Step 4: Refactored Component**

```typescript
@Component({
  selector: 'app-user-detail',
  template: `
    @if (user$ | async; as user) {
      <div>
        <h2>{{ user.name }}</h2>
        <app-user-form [user]="user" (save)="onSave($event)" />
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailComponent implements OnInit {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  
  user$ = this.userService.user;
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userService.loadUser(params['id']);
    });
  }
  
  onSave(changes: Partial<User>): void {
    this.userService.updateUser(this.getCurrentUserId(), changes).subscribe();
  }
  
  private getCurrentUserId(): number {
    // Get from route or state
    return 0;
  }
}
```

**Benefits of Refactoring:**
- ✓ Each class has one responsibility
- ✓ Easy to test (services can be mocked)
- ✓ Easy to reuse services
- ✓ Component is readable and simple
- ✓ Follows SOLID principles

---

## Scenario 3: Setting Up State Management

### Request
"We're growing and need proper state management. What's best for our feature: simple counters, user preferences, and some async data fetching?"

### Skill Response

**Step 1: Assess Complexity**
- Multiple related states (counters, preferences, async data)
- Need for derived states
- Moderate complexity

**Step 2: Propose Options**

```
A) Service + RxJS (Lightweight)
   ✓ No extra dependencies
   ✓ Works for small-medium apps
   ✗ Less tooling for debugging

B) NgRx (Enterprise)
   ✓ Time-travel debugging
   ✓ Scalable for large teams
   ✗ Learning curve, boilerplate

C) Signals (Modern)
   ✓ Least boilerplate
   ✓ Fine-grained reactivity
   ✗ Newer technology

For your use case, I recommend Option C (Signals).
```

**Step 3: Implementation**

```typescript
export interface AppState {
  counter: number;
  preferences: UserPreferences;
  data: DataItem[];
  loading: boolean;
}

@Injectable({ providedIn: 'root' })
export class AppStore {
  private readonly http = inject(HttpClient);
  
  // State Signals
  private counter = signal(0);
  private preferences = signal<UserPreferences>({ theme: 'light' });
  private data = signal<DataItem[]>([]);
  private loading = signal(false);
  
  // Public accessors
  counter$ = toObservable(this.counter);
  preferences$ = toObservable(this.preferences);
  data$ = toObservable(this.data);
  loading$ = toObservable(this.loading);
  
  // Computed
  isDarkMode = computed(() => this.preferences().theme === 'dark');
  dataCount = computed(() => this.data().length);
  
  // Actions
  increment(): void {
    this.counter.update(c => c + 1);
  }
  
  setTheme(theme: 'light' | 'dark'): void {
    this.preferences.update(p => ({ ...p, theme }));
  }
  
  loadData(): void {
    this.loading.set(true);
    this.http.get<DataItem[]>('/api/data')
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed()
      )
      .subscribe(
        data => this.data.set(data),
        error => console.error('Failed to load data', error)
      );
  }
}
```

**Usage in Components:**

```typescript
@Component({
  selector: 'app-dashboard',
  template: `
    <div [class.dark]="store.isDarkMode()">
      <p>Counter: {{ store.counter$ | async }}</p>
      <button (click)="store.increment()">+1</button>
      
      <p>Data Items: {{ store.dataCount() }}</p>
      @if (store.loading$ | async) {
        <p>Loading...</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  store = inject(AppStore);
  
  ngOnInit(): void {
    this.store.loadData();
  }
}
```

---

## Scenario 4: Creating Reusable, Testable Components

### Request
"I need a reusable search filter component. It should work with different data types, be fully testable, and follow best practices."

### Skill Response

**Design Principle:** Component should be pure (only responsible for UI, not data fetching).

```typescript
// search-filter.component.ts
export interface FilterOptions<T> {
  getSearchValue(item: T): string;
  onFilterChange: (query: string) => void;
}

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-container">
      <input
        [(ngModel)]="searchQuery"
        (ngModelChange)="onSearch($event)"
        placeholder="Search..."
        aria-label="Search items"
      />
      @if (searchQuery) {
        <button (click)="clear()" aria-label="Clear search">✕</button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFilterComponent {
  @Input() placeholder = 'Search...';
  @Output() queryChange = new EventEmitter<string>();
  
  searchQuery = '';
  
  onSearch(query: string): void {
    this.searchQuery = query;
    this.queryChange.emit(query);
  }
  
  clear(): void {
    this.searchQuery = '';
    this.queryChange.emit('');
  }
}

// search-filter.component.spec.ts
describe('SearchFilterComponent', () => {
  let component: SearchFilterComponent;
  let fixture: ComponentFixture<SearchFilterComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFilterComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(SearchFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should emit queryChange when user types', () => {
    spyOn(component.queryChange, 'emit');
    
    component.onSearch('test');
    
    expect(component.queryChange.emit).toHaveBeenCalledWith('test');
  });
  
  it('should clear search query', () => {
    spyOn(component.queryChange, 'emit');
    component.searchQuery = 'test';
    
    component.clear();
    
    expect(component.searchQuery).toBe('');
    expect(component.queryChange.emit).toHaveBeenCalledWith('');
  });
});
```

---

## Scenario 5: Handling Complex Async Operations

### Request
"I need to load user data, then load their posts, then load comments for each post. How do I handle this without callback hell?"

### Skill Response

```typescript
@Injectable()
export class DataService {
  private http = inject(HttpClient);
  
  loadUserWithPostsAndComments(userId: number): Observable<UserWithPosts> {
    return this.http.get<User>(`/api/users/${userId}`).pipe(
      // First, load the user
      switchMap(user => 
        this.http.get<Post[]>(`/api/users/${userId}/posts`).pipe(
          // Then load posts
          switchMap(posts => 
            // For each post, load comments
            combineLatest(
              posts.map(post =>
                this.http.get<Comment[]>(`/api/posts/${post.id}/comments`).pipe(
                  map(comments => ({ ...post, comments }))
                )
              )
            )
          ),
          // Combine everything
          map(postsWithComments => ({
            ...user,
            posts: postsWithComments
          }))
        )
      ),
      // Error handling
      catchError(error => {
        console.error('Failed to load data', error);
        return throwError(() => error);
      })
    );
  }
}
```

**Or more concisely with proper naming:**

```typescript
loadUserWithPostsAndComments(userId: number): Observable<UserWithPosts> {
  const user$ = this.http.get<User>(`/api/users/${userId}`);
  
  const userWithPosts$ = user$.pipe(
    switchMap(user => 
      this.loadUserPosts$(userId).pipe(
        map(posts => ({ user, posts }))
      )
    )
  );
  
  return userWithPosts$.pipe(
    switchMap(({ user, posts }) =>
      this.loadCommentsForPosts$(posts).pipe(
        map(postsWithComments => ({
          ...user,
          posts: postsWithComments
        }))
      )
    ),
    catchError(err => this.handleError(err))
  );
}

private loadUserPosts$(userId: number): Observable<Post[]> {
  return this.http.get<Post[]>(`/api/users/${userId}/posts`);
}

private loadCommentsForPosts$(posts: Post[]): Observable<PostWithComments[]> {
  return combineLatest(
    posts.map(post =>
      this.http.get<Comment[]>(`/api/posts/${post.id}/comments`).pipe(
        map(comments => ({ ...post, comments }))
      )
    )
  );
}
```

**Benefits:**
- ✓ No callback hell (no nested `.subscribe()`)
- ✓ Clear, readable RxJS chains
- ✓ Proper error handling
- ✓ Reusable helper methods

---

These examples showcase the skill's approach: propose patterns, ask questions, generate code, and create tests.
