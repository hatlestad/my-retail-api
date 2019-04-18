import * as sinon from 'sinon';
import { expect } from 'chai';

import getProduct from '../../../api/products/get';
import * as dataStore from '../../../api/lib/dataStore';

import httpMocks from 'node-mocks-http';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

const axiosMock = new MockAdapter(axios);

describe('Products GET', () => {
  let getDocFromCollectionStub;

  beforeEach(() => {
    axiosMock.reset();
    getDocFromCollectionStub = sinon.stub(dataStore, 'getDocFromCollection');
  });

  afterEach(() => {
    getDocFromCollectionStub.restore();
  });

  after(() => {
    axiosMock.restore();
  });

  describe('invalid id numbers', () => {
    it('returns 400 along with error when product id is not valid', (done) => {
      const productId = 1234;
  
      const request = httpMocks.createRequest({
        method: 'GET',
        url: `/products/${productId}`,
        params: {
          id: productId
        }
      });
      const response = httpMocks.createResponse();
  
      getProduct(request, response)
        .then(result => {
          const actualResponse = response._getData();
          const expectedResponse = JSON.stringify({ error: 'Invalid product id provided in the path.' });
  
          expect(actualResponse).to.equal(expectedResponse);
          expect(response.statusCode).to.equal(400);
          done();
        })
        .catch(done);
    });
  });
  
  describe('valid id numbers', () => {
    const productId = 42424242;
    const getRequest = {
      method: 'GET',
      url: `/products/${productId}`,
      params: {
        id: productId
      }
    };

    it('returns 404 along with error when product id cannot be found in the data store', (done) => {
      const request = httpMocks.createRequest(getRequest);
      const response = httpMocks.createResponse();

      getDocFromCollectionStub.returns(Promise.resolve(undefined));
  
      getProduct(request, response)
        .then(result => {
          const actualResponse = response._getData();
          const expectedResponse = JSON.stringify({ error: 'Unable to find requested product id.' });
  
          expect(actualResponse).to.equal(expectedResponse);
          expect(response.statusCode).to.equal(404);
          done();
        })
        .catch(done);
    });
  
    it('returns 500 along with error when product data retrieval from the data store horks', (done) => {
      const request = httpMocks.createRequest(getRequest);
      const response = httpMocks.createResponse();

      getDocFromCollectionStub.returns(Promise.reject(new Error('some error')));
  
      getProduct(request, response)
        .then(result => {
          const actualResponse = response._getData();
          const expectedResponse = JSON.stringify({ error: 'Unable to retrieve product details from data store.' });
  
          expect(actualResponse).to.equal(expectedResponse);
          expect(response.statusCode).to.equal(500);
          done();
        })
        .catch(done);
    });
  
    it('returns 500 when call to redsky horks', (done) => {
      const request = httpMocks.createRequest(getRequest);
      const response = httpMocks.createResponse();
  
      getDocFromCollectionStub.returns(Promise.resolve({ id: productId }));
      axiosMock.onGet(`https://redsky.target.com/v2/pdp/tcin/${productId}`).reply(500);
  
      getProduct(request, response)
        .then(result => {
          const actualResponse = response._getData();
          const expectedResponse = JSON.stringify({ error: 'Unable to retrieve product name from product catalog.' });
  
          expect(actualResponse).to.deep.equal(expectedResponse);
          expect(response.statusCode).to.equal(500);
          done();
        })
        .catch(done);
    });
  
    it('returns 200 when call to redsky succeeds and data is merged', (done) => {
      const request = httpMocks.createRequest(getRequest);
      const response = httpMocks.createResponse();
      const responseData = {  
        'product': { 
          'item': { 
            'product_description': { 
              'title': 'Answer to Life the Universe and Everything' 
            }
          }
        }
      };
  
      getDocFromCollectionStub.returns(Promise.resolve({ id: productId }));
      axiosMock.onGet(`https://redsky.target.com/v2/pdp/tcin/${productId}`).reply(200, responseData);
  
      getProduct(request, response)
        .then(result => {
          const actualResponse = response._getData();
          const expectedResponse = { id: productId, name: responseData.product.item.product_description.title };
  
          expect(actualResponse).to.deep.equal(expectedResponse);
          expect(response.statusCode).to.equal(200);
          done();
        })
        .catch(done);
    });
  });

});