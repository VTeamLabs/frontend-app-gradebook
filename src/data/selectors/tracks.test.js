import * as selectors from './tracks';

const tracksWithMasters = [{ slug: selectors.mastersKey }, { slug: 'other track' }];
const tracksWithoutMasters = [{ slug: 'fake track' }, { slug: 'other track' }];

describe('tracks selectors', () => {
  // Transformers
  describe('hasMastersTrack', () => {
    const selector = selectors.hasMastersTrack;
    it('returns true if a masters track is present', () => {
      expect(selector(tracksWithMasters)).toEqual(true);
    });

    it('returns false if a masters track is not present', () => {
      expect(selector(tracksWithoutMasters)).toEqual(false);
    });
  });

  // Selectors
  describe('allTracks', () => {
    const selector = selectors.allTracks;
    it('returns an empty array if no tracks found', () => {
      expect(selector({ tracks: {} })).toEqual([]);
    });

    it('returns tracks if included in result', () => {
      const results = [{ some: 'example' }, { track: 'results' }];
      expect(selector({ tracks: { results } })).toEqual(results);
    });
  });

  describe('stateHasMastersTrack', () => {
    it('returns hasMastersTracks called with allTracks as input', () => {
      const testState = { some: 'fake', state: 'values' };
      const mocks = {
        allTracks: selectors.allTracks,
        hasMastersTrack: selectors.hasMastersTrack,
      };
      selectors.allTracks = jest.fn(state => ({ allTracks: state }));
      selectors.hasMastersTrack = jest.fn((tracks) => ({ hasMastersTrack: tracks }));

      expect(selectors.stateHasMastersTrack(testState)).toEqual({
        hasMastersTrack: { allTracks: testState },
      });
      selectors.allTracks = mocks.allTracks;
      selectors.hasMastersTrack = mocks.hasMastersTrack;
    });
  });
});
