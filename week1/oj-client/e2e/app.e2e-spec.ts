import { OjTryPage } from './app.po';

describe('oj-try App', function() {
  let page: OjTryPage;

  beforeEach(() => {
    page = new OjTryPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
