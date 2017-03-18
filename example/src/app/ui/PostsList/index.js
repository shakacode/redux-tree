import { connect } from 'react-redux';

import selectors from './selectors';
import actions from './actions';
import PostsList from './components';

export default connect(selectors, actions)(PostsList);
