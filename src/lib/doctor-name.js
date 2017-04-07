import React, {PropTypes} from 'react'

const doctorName = BaseComponent => {
  const WrappedComponent = ({name}) => <BaseComponent name={`Dr. ${name}`} />

  WrappedComponent.propTypes = {
    name: PropTypes.string.isRequired
  }

  return WrappedComponent
}

export {doctorName}
