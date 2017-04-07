import test from 'ava'
import {mount} from 'enzyme'
import React from 'react'
import sinon from 'sinon'
import {doctorName} from '../doctor-name'
import {Name} from '../Name'

test('Check that name prop was altered.', t => {
  const SpyComponent = sinon.spy(props => null)
  const DoctorName = doctorName(SpyComponent)

  mount(<DoctorName name={'Jon Doe'} />)
  t.is(
    SpyComponent.lastCall.args[0].name,
    'Dr. Jon Doe',
    'SpyComponent never called with correct name'
  )
})

test('Check that hoc wraps Name component', t => {
  const DoctorName = doctorName(Name)

  const wrapper = mount(<DoctorName name={'Jon Doe'} />)
  t.is(
    wrapper.find('span').html(),
    '<span>Dr. Jon Doe</span>',
    'Did not contain correct DOM text'
  )
})
