import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCategories = createAsyncThunk('products/fetchCategories', async () => {
  const response = await axios.get('https://api.escuelajs.co/api/v1/categories');
  return response.data;
});

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ offset, limit, categoryId }) => {
    console.log('chirag',offset, limit, categoryId  )
    const categoryFilter = categoryId ? `&categoryId=${categoryId}` : '';
    const response = await axios.get(
      `https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=${limit}${categoryFilter}`
    );
    const cleanedData = response.data.map(product => {
      const cleanedImages = product.images.map(image => {
        try {
          const parsedArray = JSON.parse(image);
          return parsedArray[0] || '';
        } catch (error) {
          console.error("Error parsing image URL", error);
          return image; 
        }
      });

      return { ...product, images: cleanedImages };
    });

    return cleanedData;
  }
);

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (productId) => {
  const response = await axios.delete(`https://api.escuelajs.co/api/v1/products/${productId}`);
  if (response.data === true) return productId;
  throw new Error('Failed to delete product');
});

export const editProduct = createAsyncThunk('products/editProduct', async ({ productId, productData }) => {
  const response = await axios.put(`https://api.escuelajs.co/api/v1/products/${productId}`, productData);
  return response.data;
});

export const fetchCreateProduct = createAsyncThunk(
  'products/fetchCreateProduct',
  async (newProduct) => {
    const response = await axios.post('https://api.escuelajs.co/api/v1/products/', newProduct);
    return response.data;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    categories: [],
    selectedCategory: 'All',
    currentPage: 1,
    totalProducts: 0,
    productsPerPage: 10,
    loading: false,
    error: null,
    editingProduct: null,
    isModalVisible: false,
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1; 
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setEditingProduct: (state, action) => {
      state.editingProduct = action.payload;
      state.isModalVisible = true;
    },
    closeModal: (state) => {
      state.isModalVisible = false;
      state.editingProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.totalProducts = 100; 
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((product) => product.id !== action.payload);
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.products = state.products.map((product) =>
          product.id === action.payload.id ? { ...product, ...action.payload } : product
        );
        state.isModalVisible = false;
        state.editingProduct = null;
      })
      .addCase(fetchCreateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCreateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(fetchCreateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setSelectedCategory,
  setCurrentPage,
  setEditingProduct,
  closeModal,
} = productSlice.actions;

export default productSlice.reducer;
