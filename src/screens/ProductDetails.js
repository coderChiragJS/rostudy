import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Input, Modal, Spin, Row, Col, Typography, Divider, message } from 'antd';
import { editProduct, deleteProduct, setEditingProduct, closeModal, fetchProducts } from '../Redux/productSlice';
import dummyImage from '../images/dummy.png';

const { Title, Paragraph } = Typography;

const ProductDetails = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading, editingProduct, isModalVisible } = useSelector((state) => state.products);
  
  const product = products.find((p) => p.id === Number(productId));
  console.log("object",product)

  useEffect(() => {
    if (!products.length) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    if (!loading && !product) {
      message.error('Product not found.');
      navigate('/');
    }
  }, [loading, product, navigate]);

  const handleFormSubmit = (values) => {
    dispatch(editProduct({ productId: Number(productId), productData: values })).then(() => {
      dispatch(fetchProducts());
    });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this product?',
      onOk: () => {
        dispatch(deleteProduct(productId)).then(() => {
          message.success('Product deleted successfully');
          navigate(-1);
        });
      },
    });
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  }

  if (!product) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Product not found.</p>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>{product.title}</Title>
      
      <Row gutter={[16, 16]} justify="center">
        {product.images.map((image, index) => (
          <Col key={index} xs={24} sm={12} md={8}>
            <img
              src={product.images} 
              alt={`Product ${index + 1}`}
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = dummyImage;
              }}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                marginBottom: '10px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            />
          </Col>
        ))}
      </Row>

      <Divider />

      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col xs={24} md={12}>
          <Paragraph>
            <strong>Price:</strong> ${product.price}
          </Paragraph>
          <Paragraph>
            <strong>Description:</strong> {product.description}
          </Paragraph>
          <Paragraph>
            <strong>Category:</strong> {product.category.name}
          </Paragraph>
          <Button type="primary" onClick={() => dispatch(setEditingProduct(product))} style={{ marginRight: '10px' }}>
            Edit Product
          </Button>
          <Button type="danger" onClick={handleDelete}>
            Delete Product
          </Button>
        </Col>
      </Row>

      <Modal
        title="Edit Product"
        visible={isModalVisible}
        onCancel={() => dispatch(closeModal())}
        footer={null}
      >
        <Form
          initialValues={editingProduct}
          onFinish={handleFormSubmit}
          layout="vertical"
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please input the product title!' }]}
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
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductDetails;
