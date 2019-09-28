import { createStackNavigator} from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import Loading from './Loading';
import SignUp from './SignUp';
import Login from './Login';
import Main from './Main';

const App = createStackNavigator({
  Loading:Loading,
  Signup:SignUp,
  Login:Login,
  Main:Main
},{
  initalRouteName:"Loading"
})

const AppContainer = createAppContainer(App);

export default AppContainer;