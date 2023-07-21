import zone from 'mdast-zone';

import {afterEach, beforeEach, vi, describe, it, expect} from 'vitest';
import any from '@travi/any';
import zip from 'lodash.zip';
import {when} from 'jest-when';

import mutateZone from './zone-mutator';
import plugin from './plugin';

vi.mock('mdast-zone');
vi.mock('./zone-mutator');

describe('plugin', () => {
  let node;
  const badgeGroupNames = any.listOf(any.word);

  beforeEach(() => {
    node = {...any.simpleObject(), children: []};
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should inject the badges into the appropriate zones', () => {
    const badgeGroups = badgeGroupNames.map(() => any.objectWithKeys(
      any.listOf(any.word),
      {factory: () => ({link: any.url(), img: any.url()})}
    ));
    const transformer = plugin(Object.fromEntries(zip(badgeGroupNames, badgeGroups)));
    const zoneMutators = badgeGroupNames.map(() => () => undefined);
    zip(badgeGroups, zoneMutators).forEach(([group, mutator]) => {
      when(mutateZone).calledWith(group).mockReturnValue(mutator);
    });
    const flattenedBadgeDetails = Object.values(badgeGroups).reduce((acc, badgeGroup) => ({...acc, ...badgeGroup}), {});

    transformer(node);

    expect(mutateZone).toHaveBeenCalledTimes(badgeGroupNames.length);
    zip(badgeGroupNames, zoneMutators).forEach(([groupName, mutator]) => {
      expect(zone).toHaveBeenCalledWith(node, `${groupName}-badges`, mutator);
    });
    Object.entries(flattenedBadgeDetails).forEach(([badgeName, badgeDetails]) => {
      const linkDefinition = node.children.find(child => `${badgeName}-link` === child.label);
      const imgDefinition = node.children.find(child => `${badgeName}-badge` === child.label);

      expect(linkDefinition.url).toEqual(badgeDetails.link);
      expect(linkDefinition.type).toEqual('definition');
      expect(imgDefinition.url).toEqual(badgeDetails.img);
      expect(imgDefinition.type).toEqual('definition');
    });
  });

  it('should not add link references when a link is not included in the badge details', () => {
    const badgeGroups = badgeGroupNames.map(() => any.objectWithKeys(
      any.listOf(any.word),
      {factory: () => ({img: any.url()})}
    ));
    const transformer = plugin(Object.fromEntries(zip(badgeGroupNames, badgeGroups)));
    const zoneMutators = badgeGroupNames.map(() => () => undefined);
    zip(badgeGroups, zoneMutators).forEach(([group, mutator]) => {
      when(mutateZone).calledWith(group).mockReturnValue(mutator);
    });
    const flattenedBadgeDetails = Object.values(badgeGroups).reduce((acc, badgeGroup) => ({...acc, ...badgeGroup}), {});

    transformer(node);

    expect(mutateZone).toHaveBeenCalledTimes(badgeGroupNames.length);
    zip(badgeGroupNames, zoneMutators).forEach(([groupName, mutator]) => {
      expect(zone).toHaveBeenCalledWith(node, `${groupName}-badges`, mutator);
    });
    Object.entries(flattenedBadgeDetails).forEach(([badgeName, badgeDetails]) => {
      const linkDefinition = node.children.find(child => `${badgeName}-link` === child.label);
      const imgDefinition = node.children.find(child => `${badgeName}-badge` === child.label);

      expect(linkDefinition).toBe(undefined);
      expect(imgDefinition.url).toEqual(badgeDetails.img);
      expect(imgDefinition.type).toEqual('definition');
    });
  });

  it('should not perform injection if no badges are provided', () => {
    const transformer = plugin();

    transformer(node);
  });
});
