import React, {PropTypes} from 'react'

const Name = ({name}) => <span>{name}</span>

Name.propTypes = {
  name: PropTypes.string.isRequired
}

export {Name}
