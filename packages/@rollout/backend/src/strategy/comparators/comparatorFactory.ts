import { ComparatorEnum } from '../types';
import { Comparator } from './comparators-types';
import { equals } from './equals';

export const ComparatorFactory = {
  create: (comparatorKey: ComparatorEnum): Comparator => {
    switch (comparatorKey) {
      case ComparatorEnum.Equals: {
        return equals;
      }
    }
  },
};
