import React from 'react'
import { shallow } from 'enzyme'
import Avatar from './Avatar'

describe('Avatar', () => {

    it('displays user name', () => {
        const avatar = shallow(<Avatar user={{ name: "An user" }}/>);
        expect(avatar.find('.username').text()).toBe('An user')
    });

});