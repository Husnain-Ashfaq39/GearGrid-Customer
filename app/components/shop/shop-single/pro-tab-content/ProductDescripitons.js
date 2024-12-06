const ProductDescripitons = ({ product}) => {
  return (
    <div className="product_single_content">
      <div className="mbp_pagination_comments">
        <div className="mbp_first">
          <h5 className="title">Details</h5>


          <p className="mb30" dangerouslySetInnerHTML={{ __html: product.description }} />


          
        
        </div>
      </div>
    </div>
  );
};

export default ProductDescripitons;
