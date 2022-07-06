import md5 from 'crypto-js/md5';

// eslint-disable-next-line import/prefer-default-export
export function gravatarUrl(
  email: string,
  size = 80,
  defaultImage:
    | '404'
    | 'mp'
    | 'identicon'
    | 'monsterid'
    | 'wavatar'
    | 'retro'
    | 'robohash'
    | 'blank' = '404'
): string {
  const hash = md5(email.toLowerCase().trim());
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}`;
}
