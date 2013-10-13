module.exports = function( grunt, user_config ) {
  var utilities = user_config.utilities || {};

  /**
   * A utility function to convert a path to a temporary path for copying a file to.
   */
  utilities.createTempPath = function ( in_path ) {
    return in_path.split( '/' ).reduce( function (previousValue, currentValue, index, array ) {
      return previousValue + ( index !== 0 ? '/' : '' ) + (index === array.length - 1 ? '__TEMP__' : '') + currentValue;
    }, '' );
  }

  user_config.utilities = utilities;
};
