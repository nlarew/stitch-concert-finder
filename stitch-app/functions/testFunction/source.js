exports = function(arg){
  console.log('# System Function')
  console.log('- context.user: ', JSON.stringify(context.user))
  console.log('- context.user.data: ', JSON.stringify(context.user.data))
  console.log('- context.runningAsSystem(): ', context.runningAsSystem())
  return true
};