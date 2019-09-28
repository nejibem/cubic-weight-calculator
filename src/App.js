import React from 'react';
import './App.css';

const API_URL = 'http://wp8m3he1wt.s3-website-ap-southeast-2.amazonaws.com';
const PRODUCTS_ENDPOINT = '/api/products/1';
const CUBIC_WEIGHT_CONVERSION_FACTOR = 250;

class App extends React.Component {
  state = {
    allProducts: [],
  };

  componentDidMount() {
    this.loadProducts(API_URL, PRODUCTS_ENDPOINT);
  }

  loadProducts = (apiUrl, endpoint) => {
    fetch(apiUrl + endpoint)
      .then(res => res.json())
      .then(data => {
        this.setState((prevState) => ({
          allProducts: prevState.allProducts.concat(data.objects),
        }));
        if(data.next) {
          this.loadProducts(apiUrl, data.next);
        }
      });
  };

  filterByCategory = (products, category) => {
    return products.filter(product => product.category === category)
  };

  calculateCubicWeight = (product) => {
    const { size: { width, length, height } } = product;
    return (length/100) * (width/100) * (height/100) * CUBIC_WEIGHT_CONVERSION_FACTOR;
  };

  calculateCubicWeightsForProducts = (products) => {
    return products.map(product => ({
      ...product,
      cubicWeight: this.calculateCubicWeight(product),
    }));
  };

  calculateTotalProductsWeight = (acc, cur) => {
    return acc + cur.cubicWeight;
  };

  render() {
    const { allProducts } = this.state;

    const airConditioners = allProducts.length
      ? this.filterByCategory(allProducts, "Air Conditioners")
      : [];

    const airConditionersWithWeights = allProducts.length
      ? this.calculateCubicWeightsForProducts(airConditioners)
      : [];

    const averageAirConditionerWeight = allProducts.length
      ? airConditionersWithWeights.reduce(this.calculateTotalProductsWeight, 0) / airConditionersWithWeights.length
      : 0;

    return(
      <div className="App">
        <h1>Cubic Weight Calculator</h1>
        <h2>Air Conditioners</h2>
        <div>
          <ul>
            {airConditionersWithWeights.map((airCon) => (
                <li key={airCon.title}>{airCon.title} - {airCon.cubicWeight.toFixed(2)}kg</li>)
            )}
          </ul>
          <div>
            Average AirConditioner Weight: {averageAirConditionerWeight.toFixed(2)}kg
          </div>
        </div>
      </div>
    );
  }
}

export default App;
