export default function ([name, {text}]) {
  return {
    type: 'linkReference',
    label: `${name}-link`,
    identifier: `${name}-link`,
    referenceType: 'full',
    children: [{type: 'imageReference', label: `${name}-badge`, identifier: `${name}-badge`, alt: text}]
  };
}
