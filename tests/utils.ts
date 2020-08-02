import { NumberRange } from '../src/utils';
import { expect } from 'chai';

describe('NumberRange tests', () => {
    it('check if empty', () => {
        const range = new NumberRange(5, 3);

        expect(range.empty()).to.be.true;
    })
})
