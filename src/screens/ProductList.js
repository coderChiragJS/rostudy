import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Select, Button, Modal, Input, Form, Pagination, Spin, message, Empty } from 'antd';
import {
  fetchCategories,
  fetchProducts,
  deleteProduct,
  editProduct,
  setSelectedCategory,
  setCurrentPage,
  setEditingProduct,
  closeModal,
} from '../Redux/productSlice';

const { Option } = Select;

const ProductList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    products,
    categories,
    selectedCategory,
    currentPage,
    totalProducts,
    productsPerPage,
    isModalVisible,
    editingProduct,
    loading,
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const offset = (currentPage - 1) * productsPerPage;
    const categoryId = selectedCategory === 'All' ? null : selectedCategory;
    dispatch(fetchProducts({ offset, limit: productsPerPage, categoryId }));
  }, [dispatch, currentPage, selectedCategory, productsPerPage]);

  const handleCategoryChange = (value) => {
    dispatch(setSelectedCategory(value));
  };

  const handleEdit = (product, event) => {
    event.stopPropagation();
    dispatch(setEditingProduct(product));
  };

  const handleDelete = (productId, event) => {
    event.stopPropagation();
    dispatch(deleteProduct(productId)).then(() => {
      message.success('Product deleted successfully');
    });
  };

  const handleOk = (values) => {
    if (editingProduct) {
      dispatch(editProduct({ productId: editingProduct.id, productData: values })).then(() => {
        message.success('Product edited successfully');
        dispatch(closeModal());
      });
    }
  };

  const handleCancel = () => {
    dispatch(closeModal());
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  const navigateToDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <div style={{ marginBottom: '20px', textAlign: 'left' }}>
        <Select
          value={selectedCategory} // Set the value of the Select component to selectedCategory
          style={{ width: 200 }}
          onChange={handleCategoryChange}
        >
          <Option value="All">All Categories</Option>
          {categories.map((category) => (
            <Option key={category.id} value={category.id}>
              {category.name}
            </Option>
          ))}
        </Select>
      </div>

      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Product List</h1>

      {products.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Empty description="No products available in this category" />
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={product.title}
                      src={product.images[0] || './dummy.png'}
                      style={{ objectFit: 'cover', height: '200px' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = './dummy.png';
                      }}
                    />
                  }
                  style={{ width: '100%' }}
                  onClick={() => navigateToDetails(product.id)}
                  actions={[
                    <Button type="link" onClick={(event) => handleEdit(product, event)}>
                      Edit
                    </Button>,
                    <Button type="link" danger onClick={(event) => handleDelete(product.id, event)}>
                      Delete
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={
                      <p style={{
                        fontWeight: 'bold',
                        marginBottom: '8px',
                        fontSize: '16px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                      }}>
                        {product.title}
                      </p>
                    }
                    description={
                      <>
                        <p style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>
                          ${product.price}
                        </p>
                        <p style={{
                          fontSize: '14px',
                          color: '#555',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {product.description}
                        </p>
                      </>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Pagination
              current={currentPage}
              total={totalProducts}
              pageSize={productsPerPage}
              onChange={handlePageChange}
            />
          </div>
        </>
      )}

      {isModalVisible && (
        <Modal
          title="Edit Product"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            initialValues={editingProduct}
            onFinish={handleOk}
            layout="vertical"
          >
            <Form.Item
              label="Name"
              name="title"
              rules={[{ required: true, message: 'Please input the product name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: 'Please input the product price!' }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please input the product description!' }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default ProductList;
