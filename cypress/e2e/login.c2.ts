describe('Fluxo de Autenticação do SaaS', () => {
  it('Deve bloquear o acesso ao dashboard sem login', () => {
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
  });

  it('Deve realizar login com sucesso e exibir o dashboard com dados SSR', () => {
    cy.visit('/login');

    cy.get('input[name="email"]').type('admin@admin.com');
    cy.get('input[name="password"]').type('123456');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard SaaS').should('be.visible');
    cy.contains('Atividades Financeiras Recentes').should('be.visible');
  });
});