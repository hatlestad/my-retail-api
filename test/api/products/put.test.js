import * as sinon from 'sinon';
import { expect } from 'chai';

import putProduct from '../../../api/products/put';
import * as dataStore from '../../../api/lib/dataStore';

import httpMocks from 'node-mocks-http';

describe('Products PUT', () => {
  let updateDocOnCollectionStub;

  beforeEach(() => {
    updateDocOnCollectionStub = sinon.stub(dataStore, 'updateDocOnCollection');
  });

  afterEach(() => {
    updateDocOnCollectionStub.restore();
  });

  describe('invalid id numbers', () => {
    it('returns 400 along with error when product id is not valid', (done) => {
      const productId = 1234;
  
      const request = httpMocks.createRequest({
        method: 'PUT',
        url: `/products/${productId}`,
        body: {
          id: productId,
          current_price: {
            value: 10.00
          }
        },
        params: {
          id: productId
        }
      });
      const response = httpMocks.createResponse();
  
      putProduct(request, response)
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
    const putRequest = {
      method: 'PUT',
      url: `/products/${productId}`,
      body: {
        id: productId,
        current_price: {
          value: 10.00
        }
      },
      params: {
        id: productId
      }
    };

    it('returns 404 along with error when product id cannot be found in the data store', (done) => {
      const request = httpMocks.createRequest(putRequest);
      const response = httpMocks.createResponse();

      updateDocOnCollectionStub.returns(Promise.resolve({ code: 5 }));
  
      putProduct(request, response)
        .then(result => {
          const actualResponse = response._getData();
          const expectedResponse = JSON.stringify({ error: 'Unable to locate the product record. Record was not updated.' });
  
          expect(actualResponse).to.equal(expectedResponse);
          expect(response.statusCode).to.equal(404);
          done();
        })
        .catch(done);
    });
  
    it('returns 500 along with error when product data retrieval from the data store horks', (done) => {
      const request = httpMocks.createRequest(putRequest);
      const response = httpMocks.createResponse();

      updateDocOnCollectionStub.returns(Promise.reject(new Error('some error')));
  
      putProduct(request, response)
        .then(result => {
          const actualResponse = response._getData();
          const expectedResponse = JSON.stringify({ error: 'Unable to update price on product.' });
  
          expect(actualResponse).to.equal(expectedResponse);
          expect(response.statusCode).to.equal(500);
          done();
        })
        .catch(done);
    });

    it('returns 200 when data is successfully updated in data store', (done) => {
      const request = httpMocks.createRequest(putRequest);
      const response = httpMocks.createResponse();
  
      updateDocOnCollectionStub.returns(Promise.resolve());
  
      putProduct(request, response)
        .then(result => {
          const actualResponse = response._getData();
          const expectedResponse = putRequest.body;
  
          expect(actualResponse).to.deep.equal(expectedResponse);
          expect(response.statusCode).to.equal(200);
          done();
        })
        .catch(done);
    });
  
    it('returns 200 when data is successfully updated in data store and response contains code equal to 0', (done) => {
      const request = httpMocks.createRequest(putRequest);
      const response = httpMocks.createResponse();
  
      updateDocOnCollectionStub.returns(Promise.resolve({ code: 0 }));
  
      putProduct(request, response)
        .then(result => {
          const actualResponse = response._getData();
          const expectedResponse = putRequest.body;
  
          expect(actualResponse).to.deep.equal(expectedResponse);
          expect(response.statusCode).to.equal(200);
          done();
        })
        .catch(done);
    });
  });

});