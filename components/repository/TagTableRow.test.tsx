import React from 'react'
import { mount } from 'enzyme'
import TagTableRow from './TagTableRow'

describe('TagTableRow', () => {

    it('displays tag', () => {
        const row = mount(<TagTableRow
            repository='repo'
            tag={{ version: 'v1' }}
        />);

        expect(row.text()).toContain('v1');
    });

});
