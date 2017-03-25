# redux-tree

[![npm version](https://img.shields.io/npm/v/redux-tree.svg?style=flat-square)](https://www.npmjs.com/package/redux-tree)
[![build status](https://img.shields.io/travis/shakacode/redux-tree/master.svg?style=flat-square)](https://travis-ci.org/shakacode/redux-tree)
[![dependencies status](https://img.shields.io/gemnasium/shakacode/redux-tree.svg?style=flat-square)](https://gemnasium.com/shakacode/redux-tree)
[![license](https://img.shields.io/npm/l/redux-tree.svg?style=flat-square)](https://www.npmjs.com/package/redux-tree)

An alternative way to compose Redux reducers.


## Interactions pattern
`redux-tree` is a part of the [`interactions`](https://github.com/shakacode/redux-interactions) pattern. Check it out to get more context.


## Table of Contents

* [State as a Tree](#state-as-a-tree)
* [Installation](#installation)
* [Examples](#examples)
* [API](#api)
* [Migration](#migration)
* [Thanks](#thanks)
* [License](#license)


## State as a Tree
Application state can be represented as a `tree`, which is a combination of `branches` and `leaves`. A branch doesn’t hold any state itself but is a grouping of leaves that each hold chunks of the application state. If state is flat, then `tree` consists only of `leaves`.

```
state:
  entities:
    posts: { index, entities }
    comments: { entities }
  ui:
    postsList: { processingPosts }
    ...
```
_For example, the branch `state.entities` groups the states of the `posts` leaf, `comments` leaf, etc._

Let’s say a user manages his posts and removes one of them by clicking the “Delete” button. What’s happening under the hood? The state of this UI part is stored in the `state.ui.postsList` leaf. Clicking on the button, a user triggers an action creator and the app starts a request to the server. In response to this action, `postId` is added to the `processingPosts` set to show the spinner in the UI. It requires a change of the single `ui.postsList` leaf. Let’s describe it in the interaction module:

```js
// Action creator: returns request action
const requestAction = postId => ({
  type: 'POST_DELETE_REQUESTED',
  postId,
});

// Action handler: reduces the state of the single leaf
const onRequest = {
  POST_DELETE_REQUESTED:
    (state, { postId }) =>
      state.update('processingPosts', processingPosts => processingPosts.add(postId)),
};
```

When a server responds with a success:
* `postId` must be removed from the `processingPosts`
* `post` entity must be removed from the `entities.posts` leaf. 

This action entails changing 2 different leaves:

```js
// Action creator: returns success action
const successAction = postId => ({
  type: 'POST_DELETE_SUCCEEDED',
  postId,
});

// Action handlers: passing array of the reducers for this action type
//                  to apply sequence of the changes to the state tree
const onSuccess = {
  POST_DELETE_SUCCEEDED: [
    // 1. hide spinner
    (state, { postId }) =>
      state.update('processingPosts', processingPosts => processingPosts.delete(postId)),

    // 2. remove post entity
    {
      leaf: ['entities', 'posts'], // <= keypath to the leaf of the state
      reduce:
        (postsEntitiesState, { postId }) =>
          postsEntitiesState
            .updateIn(['index'], index => index.delete(postId))
            .updateIn(['entities'], entities => entities.delete(postId)),
    },
  ],
};
```

To make this code work, few internal changes are required in how Redux iterates over the reducers. Under the hood, `redux-tree` is an alternative version of Redux’s `combineReducers`, which makes it possible to represent changes to the state as a sequence of functions. This allows describing interactions in a very concise and consistent manner.

It’s super easy to integrate `redux-tree` into existing codebases as it supports classic reducers (so incremental adoption is absolutely possible, see [Migration](#migration)) and it should be compatible with the most of the packages from Redux ecosystem. The main change it introduces is how Redux internally iterates over the reducers.

In the initial release of `redux-tree`, state is represented as an Immutable `Record`. We use Immutable a lot in our apps; it makes it easier to handle deep updates and prevent state mutations, Record allows access to properties using dot notation (as opposed to getters), and it’s possible to strongly type the state tree with `flow`. So, [`immutable-js`](http://facebook.github.io/immutable-js) is required (at least for now).


## Installation

```shell
# yarn / npm
yarn add redux-tree
npm install --save redux-tree

# don't forget to install redux & immutable
yarn add redux immutable
npm install --save redux immutable
```

## Examples

* **Counter**

```js
import { createStore } from 'redux';
import { createTree, createLeaf } from 'redux-tree';

const tree = createTree({
  counter: createLeaf(0, {
    INCREMENT: state => state + 1,
    DECREMENT: state => state - 1,
  }),
});

const store = createStore(tree);

store.subscribe(() => console.log(store.getState()));

store.dispatch({ type: 'INCREMENT' }); // => { counter: 1 }
store.dispatch({ type: 'INCREMENT' }); // => { counter: 2 }
store.dispatch({ type: 'DECREMENT' }); // => { counter: 1 }
```

* **Advanced** [ [live](https://redux-tree.now.sh) &middot; [source](./example/src/app) ]
* See more advanced examples (incl. usage w/ `flow`) in [`redux-interactions`](https://github.com/shakacode/redux-interactions) repo.


## API
`redux-tree` exposes 3 modules:

### `createTree`
`createTree` receives 1 argument: object with branches and/or leaves. Returns a `tree`, in fact this is a root reducer.

```js
import { createTree } from 'redux-tree';

const tree = createTree({
  auth: authLeaf,
  entities: entitiesBranch,
  ui: uiBranch,
});

type Tree = (state: State, action: Action) => State;
type CreateTree = ({ [key: string]: Branch | Leaf }) => Tree;

// Then pass it to redux's `createStore` instead of reducer
const store = createStore(tree, initialState, enhancers);
```


### `createBranch`
`createBranch` also receives 1 argument: object with branches and/or leaves. You don't need this method if your state tree is 1 level deep. Returns a `branch`.

```js
import { createBranch } from 'redux-tree';

const branch = createBranch({
  posts: postsLeaf,
  comments: commentsLeaf,
})

type CreateBranch = ({ [key: string]: Branch | Leaf }) => Branch;
```


### `createLeaf`
You can pass 2 types of arguments to `createLeaf`:

1. Single argument: classic reducer function, which takes state of the leaf and action and returns next leaf state.
2. Two arguments: initial state of the leaf and object with action handlers.

```js
import { createLeaf } from 'redux-tree';

const leaf = createLeaf(initialState, actionHandlers);
const leaf = createLeaf(reducer);

type CreateLeaf =
  | (initialState: LeafState, actionHandlers?: ActionHandlers) => Leaf
  | (reducer: Reducer) => Leaf
;
```


#### Action handlers
Action handlers are stored in an object. Its keys are action types, and values are action handlers (reducers). You can define reducers in the following ways:

**As a function**. It receives the state of the leaf to which it was initially passed and dispatched action. Must return a state of the leaf.

```js
{ ACTION_TYPE: (state, action) => state }
```

**As an object** with:
* `leaf`: keypath to the leaf in the state
* `reduce`: reducer, which receives state of the leaf at provided keypath and dispatched action. Must return a state of the leaf.

```js
{
  ACTION_TYPE: {
    leaf: ['path', 'to', 'leaf'],
    reduce: (state, action) => state,
  },
}
```

**As an array** of the previous two. Useful when you need to change the state of the multiple leaves in response to single action.

```js
{
  ACTION_TYPE: [
    (state, action) => state, // function receives state of the local leaf

    {
      leaf: ['path', 'to', 'leaf'],
      reduce: (state, action) => state, // receives the state of the leaf at the keypath
    },
  ],
}
```


## Migration
To integrate `redux-tree` into existing codebase, no need to refactor all the reducers at once. You can pass existing ones to the `createLeaf` and refactor them incrementally:

```js
import { createLeaf } from 'redux-tree';

function counterReducer(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

export default createLeaf(counterReducer);
```

### Usage with `combineReducers`
It is possible to define `tree` as a child of vanilla reducer, created with `combineReducers`.

```js
const rootReducer = combineReducers({
  vanillaReducers: combineReducers({
    vanillaReducer: (state, action) => state,
  }),
  tree: createTree({
    entities: createBranch({
      posts: createLeaf(initialState, actionHandlers),
    }),
  }),
});
```

Keep in mind that `tree` doesn't know anything about parents, and in action handler you can't change a state of an external leaf at keypath outside of the tree. All keypaths must be provided relative to the tree's root node. Basically, keypaths must be the same as if child tree would be a root reducer. _But you still can respond to any action in any reducer in case you need this._

## Thanks
To [Alberto Leal](https://albertoleal.ca/) for handing over the `redux-tree` NPM package name.

## License
It's MIT.
