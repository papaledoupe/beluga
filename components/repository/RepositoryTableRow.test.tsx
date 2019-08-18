import React from 'react'
import { mount } from 'enzyme'
import RepositoryTableRow from './RepositoryTableRow'

describe('RepositoryTableRow', () => {

    it('displays repository', () => {
        const row = mount(<RepositoryTableRow
            repository={{ name: 'my/repo' }}
        />);

        expect(row.text()).toContain('my/repo');
    });

});
