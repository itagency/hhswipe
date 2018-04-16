export const truncateTitle = (title) => {
  if (title.length > 25) {
    return title.substring(0, 24) + '...';
  } else {
    return title;
  }
};

export const truncateDescription = (desc) => {
  if (desc.length > 100) {
    return desc.substring(0, 99) + '...';
  } else {
    return desc;
  }
};