import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../../shared/models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProduct: Product = {
    id: 1,
    name: 'Widget',
    sku: 'WDG-001',
    category: 'Hardware',
    costPrice: 10,
    sellPrice: 20,
    stock: 50,
    reorderLevel: 10,
    status: 'Active',
    supplier: 'Acme',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should fetch all products', () => {
    service.getAll().subscribe((products) => {
      expect(products.length).toBe(1);
      expect(products[0].name).toBe('Widget');
    });

    const req = httpMock.expectOne('/api/products');
    expect(req.request.method).toBe('GET');
    req.flush([mockProduct]);
  });

  it('should create a product', () => {
    const { id, ...payload } = mockProduct;
    service.create(payload as Product).subscribe((created) => {
      expect(created.id).toBe(1);
    });

    const req = httpMock.expectOne('/api/products');
    expect(req.request.method).toBe('POST');
    req.flush(mockProduct);
  });
});
