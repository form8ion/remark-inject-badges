export default function ([name, {text, link}]) {
  const imageReference = {type: 'imageReference', label: `${name}-badge`, identifier: `${name}-badge`, alt: text};

  if (!link) return imageReference;

  return {
    type: 'linkReference',
    label: `${name}-link`,
    identifier: `${name}-link`,
    referenceType: 'full',
    children: [imageReference]
  };
}
