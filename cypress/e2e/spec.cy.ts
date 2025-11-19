describe("Flujo completo de registro, login y logout", () => {
  const random = Math.floor(Math.random() * 10000);
  const user = {
    name: `usuario${random}`,
    email: `test${random}@correo.com`,
    password: "123456",
  };
    

  // it('debe manejar errores de login con credenciales incorrectas', () => {
  //   cy.visit('/login');
    
  //   // Intentar login con credenciales incorrectas
  //   cy.get('input[name="email"]').type('Usuario incorrecto');
  //   cy.get('input[name="password"]').type('usuario@incorrecto.com');
  //   cy.contains("Iniciar sesión").click();
    
  //   // Verificar mensaje de error
  //   cy.get('p').should('contain', 'Credenciales inválidas');
    
  //   // Verificar que permanecemos en la página de login
  //   cy.url().should('eq', Cypress.config().baseUrl + '/');
  // });



  it("Debe registrar, iniciar sesión, mandar correo  y cerrar sesión", () => {
    // Página principal
    cy.visit("/");

    // Ir a registro
    cy.visit("/login");
    cy.contains("Regístrate aquí").click();


    // Llenar formulario de registro
    cy.get('input[placeholder="Nombre"]').type(user.name);
    cy.get('input[placeholder="Correo electrónico"]').type(user.email);
    cy.get('input[placeholder="Contraseña"]').type(user.password);

    // Enviar formulario
    cy.get('button[type="submit"]').click();

    // Esperar el mensaje de éxito
    cy.contains("Usuario registrado correctamente", { timeout: 5000 });

    // Esperar redirección al login
    cy.url().should("include", "/login");

    // Hacer login
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="password"]').type(user.password);
    cy.contains("Iniciar sesión").click();

    // Comprobar que llegó al dashboard
    cy.url({ timeout: 10000 }).should("include", "/dashboard");
    cy.contains("Bienvenido al panel de control"); //Asegurarse de que el mensaje es el correvto

    // Click en el boto de enviar correo
    cy.contains("Enviar Email de Prueba").click();

    // Cerrar sesión
    cy.contains("Cerrar Sesión").click();

    // Validar que vuelve al login cuando hace logout 
    cy.url().should("include", "/login");
  });
});
