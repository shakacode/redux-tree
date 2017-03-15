import { Record } from 'immutable';

import { createTree, createBranch } from '../../src';

export const EntityLeaf = Record({ index: new Set() });
export const UILeaf = Record({ processingEntities: new Set() });

export const mockTree = ({ entityLeaf, uiLeaf }) => createTree({
  entities: createBranch({ entityLeaf }),
  ui: createBranch({ uiLeaf }),
});
