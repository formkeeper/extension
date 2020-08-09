import useField from "../../hooks/useField";

/*
  VirtualField is a component that doesn't render anything, instead it's linked
  to an actual DOM Element as a bridge for the app interaction with the element
  (although for current use cases of the app it doesn't even store the state
  of the element).

  VirtualField is not even an uncontrolled component.

  This app runs in the context of a Web Extension and this is a very special
  use case because we want our extension to react to existing third-party DOM
  elements events. That's why this component is so special: it's a bridge
  between the actual DOM element and our react flow.

  In the future this may be used as a representation of the field if e.g. we
  want to allow users to interact with the fields.
*/
function VirtualField({ field, fieldHash }) {
  useField(field, fieldHash);
  return null;
}

export default VirtualField;