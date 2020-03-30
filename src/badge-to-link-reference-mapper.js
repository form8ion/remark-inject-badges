export default function ([name, {text}]) {
  return {
    type: 'linkReference',
    label: `${name}-link`,
    children: [{type: 'imageReference', label: `${name}-badge`, alt: text}]
  };
}
