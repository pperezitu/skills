# SOLID Principles in Angular

## Single Responsibility Principle (SRP)

**Definition:** A class should have only one reason to change.

### ❌ Bad Example
```typescript
// UserComponent does too much
@Component({
  selector: 'app-user',
  template: `...`
})
export class UserComponent {
  users: User[] = [];
  
  constructor(private http: HttpClient) {}
  
  loadUsers() {
    // Direct HTTP call
    this.http.get('/api/users').subscribe(data => this.users = data);
  }
  
  saveUser(user: User) {
    // Direct HTTP call
    this.http.post('/api/users', user).subscribe();
  }
  
  deleteUser(id: number) {
    // Direct HTTP call
    this.http.delete(`/api/users/${id}`).subscribe();
  }
}
```

### ✓ Good Example
```typescript
// Service: Handles data
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }
  
  saveUser(user: User): Observable<User> {
    return this.http.post<User>('/api/users', user);
  }
  
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`/api/users/${id}`);
  }
}

// Component: Handles presentation
@Component({
  selector: 'app-user',
  template: `...`
})
export class UserComponent implements OnInit {
  users$ = this.userService.getUsers();
  
  constructor(private userService: UserService) {}
}
```

---

## Open/Closed Principle (OCP)

**Definition:** Classes should be open for extension but closed for modification.

### ❌ Bad Example
```typescript
export class ReportGenerator {
  generateReport(type: string): string {
    if (type === 'pdf') {
      return this.generatePDF();
    } else if (type === 'excel') {
      return this.generateExcel();
    } else if (type === 'html') {
      return this.generateHTML();
    }
    // Adding new type = modifying this class
    throw new Error('Unknown type');
  }
  
  private generatePDF(): string { /* ... */ }
  private generateExcel(): string { /* ... */ }
  private generateHTML(): string { /* ... */ }
}
```

### ✓ Good Example
```typescript
// Abstraction
export interface ReportStrategy {
  generate(): string;
}

// Implementations
export class PDFReport implements ReportStrategy {
  generate(): string { /* ... */ }
}

export class ExcelReport implements ReportStrategy {
  generate(): string { /* ... */ }
}

export class HTMLReport implements ReportStrategy {
  generate(): string { /* ... */ }
}

// Extensible
@Injectable({ providedIn: 'root' })
export class ReportGenerator {
  constructor(private strategy: ReportStrategy) {}
  
  generateReport(): string {
    return this.strategy.generate();
    // New types don't require modification here
  }
}

// Usage: Inject the specific report type
```

---

## Liskov Substitution Principle (LSP)

**Definition:** Subtypes must be substitutable for their base types.

### ❌ Bad Example
```typescript
export class Animal {
  move(): string {
    return 'Moving...';
  }
}

export class Bird extends Animal {
  move(): string {
    return 'Flying...';
  }
}

export class Penguin extends Bird {
  move(): string {
    // Violates LSP: penguin can't fly
    throw new Error('Cannot fly');
  }
}

// Code breaks if you pass Penguin where Bird is expected
```

### ✓ Good Example
```typescript
export interface Movable {
  move(): string;
}

export class Bird implements Movable {
  move(): string {
    return 'Flying...';
  }
}

export class Penguin implements Movable {
  move(): string {
    return 'Swimming...';
  }
}

// Both are interchangeable, no surprises
```

---

## Interface Segregation Principle (ISP)

**Definition:** Clients should not be forced to depend on interfaces they don't use.

### ❌ Bad Example
```typescript
export interface Worker {
  work(): void;
  manage(): void;
  report(): void;
  code(): void;
}

// Not all workers code or manage
export class Manager implements Worker {
  work(): void { /* manage work */ }
  manage(): void { /* manage team */ }
  report(): void { /* report */ }
  code(): void { throw new Error('Managers don\'t code'); } // Forced!
}
```

### ✓ Good Example
```typescript
export interface Worker {
  work(): void;
}

export interface Manager {
  manage(): void;
  report(): void;
}

export interface Developer extends Worker {
  code(): void;
}

export class TeamLead implements Worker, Manager {
  work(): void { /* ... */ }
  manage(): void { /* ... */ }
  report(): void { /* ... */ }
}

export class EngineerDeveloper implements Developer {
  work(): void { /* ... */ }
  code(): void { /* ... */ }
}
```

---

## Dependency Inversion Principle (DIP)

**Definition:** High-level modules should not depend on low-level modules. Both should depend on abstractions.

### ❌ Bad Example
```typescript
// High-level: UserComponent
// Low-level: HttpUserRepository
export class HttpUserRepository {
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }
}

@Component({ /* ... */ })
export class UserComponent {
  constructor(private repo: HttpUserRepository) {}
  // Tightly coupled to HTTP implementation
}

// If you want to switch to a different data source, change the component!
```

### ✓ Good Example
```typescript
// Abstraction
export interface UserRepository {
  getUsers(): Observable<User[]>;
}

// Low-level implementations
export class HttpUserRepository implements UserRepository {
  constructor(private http: HttpClient) {}
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }
}

export class MockUserRepository implements UserRepository {
  getUsers(): Observable<User[]> {
    return of([/* mock data */]);
  }
}

// High-level: depends on abstraction
@Component({ /* ... */ })
export class UserComponent {
  constructor(private repo: UserRepository) {}
  // Loosely coupled, easy to test with mocks
}

// In module:
// {
//   provide: UserRepository,
//   useClass: HttpUserRepository // or MockUserRepository
// }
```

---

## Angular-Specific Applications

### Services as Abstractions
```typescript
// Abstraction
@Injectable()
export abstract class DataService<T> {
  abstract getAll(): Observable<T[]>;
  abstract getOne(id: any): Observable<T>;
  abstract create(item: T): Observable<T>;
  abstract update(id: any, item: T): Observable<T>;
  abstract delete(id: any): Observable<void>;
}

// Implementation
@Injectable({ providedIn: 'root' })
export class UserDataService extends DataService<User> {
  constructor(private http: HttpClient) { super(); }
  
  getAll(): Observable<User[]> { /* ... */ }
  // ...
}
```

### Dependency Injection Configuration
```typescript
// Provide different implementations based on environment
export const APP_PROVIDERS = [
  {
    provide: UserRepository,
    useClass: isProduction ? HttpUserRepository : MockUserRepository
  }
];
```
