export function Alert({ type = 'warning', heading, Children }) {
  /* obj1 = {
    type: 'information',
    heading: 'Success'
  } */

  return (
    <>
      <div>{type === 'warning' ? 'Warn' : 'Info'}</div>
      <div>{heading}</div>
      <div>{Children}</div>
    </>
  );
}
