# redux-tree

[![npm version](https://img.shields.io/npm/v/redux-tree.svg?style=flat-square)](https://www.npmjs.com/package/redux-tree)
[![build status](https://img.shields.io/travis/shakacode/redux-tree/master.svg?style=flat-square)](https://travis-ci.org/shakacode/redux-tree)
[![dependencies status](https://img.shields.io/gemnasium/shakacode/redux-tree.svg?style=flat-square)](https://gemnasium.com/shakacode/redux-tree)
[![license](https://img.shields.io/npm/l/redux-tree.svg?style=flat-square)](https://www.npmjs.com/package/redux-tree)

An alternative way to compose Redux reducers.


## State as a Tree
Application state can be represented as a `tree`, which is a combination of `branches` and `leaves`. Branch doesn't hold any state itself, but groups the leaves. Each leaf holds the part of the application state.

```
state:
  entities:
    posts: { index, entities }
    comments: { entities }
  ui:
    postsList: { processingPosts }
    ...
```
_E.g., branch `state.entities` holds the state of `posts` leaf, `comments` leaf etc._

When user interacts with UI, application changes its state. Let's say user manages his posts and removes one of them by clicking the "Delete" button.

What's happening under the hood. The state of this UI part is stored in the `state.ui.postsList` leaf. Clicking on the button, user triggers action creator and app starts request to the server. On this action `postId` is added to the `processingPosts` set to show the spinner in the UI. It requires a change in the single `ui.postsList` leaf:

```js
// Action creator: dispatching request action
dispatch({
  type: 'POST_DELETE_REQUESTED',
  postId,
})

// Action handler: reducing the state of the single leaf
POST_DELETE_REQUESTED:
  (state, { postId }) =>
    state.update('processingPosts', processingPosts => processingPosts.add(postId))
```

When server responds with the success:
* `postId` must be removed from the `processingPosts` set
* post entity must be removed from the `entities.posts` leaf.

This action requires the changes of the 2 different leaves:

```js
// Action creator: dispatching success action
dispatch({
  type: 'POST_DELETE_SUCCEEDED',
  postId,
})

// Action handlers: passing array of the reducers for this action type
//                  to apply sequence of the changes in the state tree
POST_DELETE_SUCCEEDED: [
  // 1. hiding spinner
  (state, { postId }) =>
    state.update('processingPosts', processingPosts => processingPosts.delete(postId)),

  // 2. removing post entity
  {
    leaf: ['entities', 'posts'], // <= keypath to the leaf
    reduce:
      (postsEntitiesState, { postId }) =>
        postsEntitiesState
          .updateIn(['index'], index => index.delete(postId))
          .updateIn(['entities'], entities => entities.delete(postId)),
  },
]
```

To make this code work, few internal changes are required in how Redux iterates over the reducers. Instead of tightly couple each reducer to the single leaf, let’s let the leaf decide which part(s) of the state will be updated in the response to the action. This is what `redux-tree` does.

---

`redux-tree` is a direct continuation of the ideas I stated in [this medium post](https://blog.shakacode.com/a-year-of-development-with-redux-part-iii-7a0e9a7d7670) as it allows declaring `interactions` in even more concise manner.

Under the hood, it is an alternative version of Redux's `combineReducers` method, which makes possible to represent the changes in the state, caused by the action, as a sequence of functions.

It's super easy to integrate `redux-tree` into existing codebase as it supports classic reducers and should be compatible with the most of the packages from Redux ecosystem as the main change it introduces is how Redux _internally_ iterates over the reducers.

`redux-tree` represents the state as an Immutable `Record` to handle deep updates, prevent state mutations, preserve access to the state items using dot notation and strongly type state tree with the `flow`. [`immutable-js`](http://facebook.github.io/immutable-js/) is required.


## Installation

```shell
# yarn / npm
yarn add redux-tree
npm install --save redux-tree

# don't forget to install redux & immutable
yarn add redux immutable
npm install --save redux immutable
```

## Example
[Sources](./example/src/app) &middot; [Live](http://redux-tree.surge.sh)


## API
`redux-tree` exposes 3 modules:


### `createTree`

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

`createTree` receives 1 argument: object with branches and/or leaves. Returns a `tree`, in fact this is a root reducer.


### `createBranch`

```js
import { createBranch } from 'redux-tree';

const branch = createBranch({
  posts: postsLeaf,
  comments: commentsLeaf,
})

type CreateBranch = ({ [key: string]: Branch | Leaf }) => Branch;
```

`createBranch` also receives 1 argument: object with branches and/or leaves. You don't need this method if your state tree is 1 level deep. Returns a `branch`.


### `createLeaf`

```js
import { createLeaf } from 'redux-tree';

const leaf = createLeaf(initialState, actionHandlers);
const leaf = createLeaf(reducer);

type CreateLeaf =
  | (initialState: LeafState, actionHandlers?: ActionHandlers) => Leaf
  | (reducer: Reducer) => Leaf
;
```

You can pass 2 types of arguments to `createLeaf`:

1. Single argument: classic reducer function, which takes state of the leaf and action and returns next leaf state.
2. Two arguments: initial state of the leaf and object with action handlers.


#### Action handlers

Action handlers are stored in an object. Its keys are action types, and values are action handlers (reducers). You can define reducers in the following ways:

**As a function**. It receives the state of the leaf to which it was initially passed and dispatched action. Must return a state of the leaf.

```js
{ ACTION_TYPE: (state, action) => state }
```

**As an object** with:
* `leaf`: keypath to the leaf in the state
* `reduce`: reducer, which receives state of the leaf at provided keypath and dispatched action.

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


## Thanks

To [Alberto Leal](https://albertoleal.ca/) for handing over the `redux-tree` NPM package name.

## License
It's MIT.
