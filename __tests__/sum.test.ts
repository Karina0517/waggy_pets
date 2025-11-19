import { sum, mult } from '../src/app/lib/sum';

describe('sum', () => {
  it('suma números', () => {
    expect(sum(2, 3)).toBe(5);
  });

  it('maneja negativos', () => {
    expect(sum(-2, 3)).toBe(1);
  });
});  

describe('mult', () => {
  it('multiplica números positivos', () => {
    expect(mult(2, 3)).toBe(6);
  });

  it('maneja ceros', () => {
    expect(mult(5, 0)).toBe(0);
  });

  it('maneja números negativos', () => {
    expect(mult(-2, 3)).toBe(-6);
  });
});