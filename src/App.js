
import './App.css';
import Layout from './Componnents/Layout/Layout';
import { Route, Switch } from 'react-router-dom';
import Product from './Containers/Product';

function App() {
  return (
      < Layout >
        <Switch>
          <Route path={"/Product" } exact component={Product} />
        </Switch>
      </Layout>
  );
}

export default App;
