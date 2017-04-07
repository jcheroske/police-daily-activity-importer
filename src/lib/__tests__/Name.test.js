import test from 'ava'
import {shallow} from 'enzyme'
import React from 'react'
import {Name} from '../Name'

test('Check Name DOM content.', t => {
  const wrapper = shallow(<Name name={'Jon Doe'} />)
  t.true(wrapper.contains(<span>Jon Doe</span>), 'Did not contain correct DOM text')
})
