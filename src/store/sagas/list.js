import {all, takeLatest, call, put, select} from 'redux-saga/effects';

import {types} from '../ducks/list';
import * as service from '~/services/';

import {NavigationActions} from 'react-navigation';

import {SnackbarShow, snackbarShowError} from '~/store/ducks/snackbar';

function* getProducts() {
  try {
    yield put({type: types.ASYNC_GET_PRODUCTS});
    const {data} = yield call(service.getProductsList);
    const products = data.Products;

    const bestProducts = yield call(getBestProducts, products);

    yield put({type: types.GET_PRODUCTS, payload: bestProducts});
  } catch (error) {
    yield put({type: types.GET_PRODUCTS_FAIL});
    yield put(
      snackbarShowError(
        'Ocorreu um erro buscar os produtos do servidor. Tente novamente.',
      ),
    );
  }
}

function* getProductsPaginate({payload}) {
  const page = payload.page;
  try {
    const {data} = yield call(service.getProductsListPaginate, page);
    const products = data.Products;

    const bestProducts = yield call(getBestProducts, products);

    const currentList = yield select(state => state.list.list);

    currentList.push.apply(currentList, bestProducts);

    yield put({type: types.GET_PRODUCTS_PAGINATE, payload: currentList});
  } catch (error) {
    yield put({type: types.GET_PRODUCTS_FAIL});
    yield put(
      snackbarShowError(
        'Ocorreu um erro buscar os produtos do servidor. Tente novamente.',
      ),
    );
  }
}

function* getProductsBySearch(action) {
  try {
    const query = action.payload.search;
    const newQuery = query.replace('?map=c,c', '');

    const {data} = yield call(service.getProductsListSearch, newQuery);
    const products = data.Products;

    const bestProducts = yield call(getBestProducts, products);

    yield put({type: types.GET_PRODUCTS, payload: bestProducts});
    yield put(
      NavigationActions.navigate({
        routeName: 'Main',
      }),
    );
  } catch (error) {
    yield put({type: types.GET_PRODUCTS_FAIL});
    yield put(
      snackbarShowError(
        'Ocorreu um erro buscar os produtos do servidor. Tente novamente.',
      ),
    );
  }
}

function* getBestProducts(products) {
  let productsList = [];

  products.forEach(element => {
    let bestSku = null;

    element.Skus.forEach(sku => {
      let skuCount = 0;
      sku.Sellers.forEach(seller => {
        if (bestSku === null || seller.Price < bestSku) {
          bestSku = skuCount;
        }
        skuCount++;
      });
    });
    productsList.push(element.Skus[bestSku]);
  });

  return productsList;
}

export default function* listSaga() {
  yield call(getProducts);
  yield all([
    takeLatest(types.ASYNC_GET_PRODUCTS, getProducts),
    takeLatest(types.ASYNC_GET_PRODUCTS_PAGINATE, getProductsPaginate),
    takeLatest(types.ASYNC_GET_PRODUCTS_SEARCH, getProductsBySearch),
  ]);
}
