let app;

switch (process.env.NODE_ENV) {
  case 'test':
    app.set('port', process.env.PORT_TEST);
    break;
  case 'development':
    app.set('port', process.env.PORT_DEV);
    break;
  case 'production':
    app.set('port', process.env.PORT_PROD);
    break;
  default:
    app.set('port', 3000);
    break;
}
