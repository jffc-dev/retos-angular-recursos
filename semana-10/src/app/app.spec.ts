import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {

  beforeEach(() => {
    //antes de cada it
    TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    });
  })

  beforeAll(() => {
    //antes de que se ejecute el primer it
  })

  it('debe crear la app', () => {
    //Arrange
    //Act
    const fixture = TestBed.createComponent(App);
    //Assert
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('comprobar la relacion entre evento y data', () => {
    const fixture = TestBed.createComponent(App);

    expect(fixture.componentInstance.evento()).toBe(fixture.componentInstance.data);
  });

  it('debe contener el router', () => {
    const fixture = TestBed.createComponent(App);
    const compilado = fixture.nativeElement as HTMLElement
    expect(compilado.getElementsByTagName('router-outlet')).toBeTruthy()
  })
});
