import React from 'react';
import Text from 'elements/text';
import Button from 'elements/button';
import Dialog from 'elements/dialog';
import Input from 'elements/input';
import display from 'content/display';
import Animation from 'content/animation';
import { colors } from 'utils';
import { Dropdown } from '../elements/dropdown';

const DuplicateToOtherDialog = ({ open, setOpen, appInterface }) => {
  const [selectedSpritesheet, setSelectedSpritesheet] = React.useState('');
  const [completedArr, setCompletedArr] = React.useState(null);
  const onConfirm = async () => {
    const { animations } = display.pictures[appInterface.imageName] || {
      animations: [],
    };

    const {
      spriteWidth: origSpriteWidth,
      spriteHeight: origSpriteHeight,
    } = display.pictures[appInterface.imageName];

    display.updatePictureSpriteSize(
      selectedSpritesheet,
      origSpriteWidth,
      origSpriteHeight
    );

    const copied = [];
    animations.forEach(animName => {
      const anim = display.getAnimation(animName);
      const newAnimName = getNewAnimName(anim.name);
      if (!display.hasAnimation(newAnimName)) {
        copied.push(newAnimName);
        display.createAnimation(newAnimName, selectedSpritesheet, () => {
          let a = new Animation(anim.loop, display);
          a.name = newAnimName;
          a.isCadence = anim.isCadence;
          anim.sprites.forEach(obj => {
            const origSpriteIndex = obj.name.slice(
              obj.name.lastIndexOf('_') + 1
            );
            a.addSprite({
              name: selectedSpritesheet + '_' + origSpriteIndex,
              duration: obj.durationMs,
              opacity: obj.opacity,
              offsetX: obj.offsetX,
              offsetY: obj.offsetY,
            });
          });
          return a;
        });
      }
    });
    setCompletedArr(copied);
  };

  const getNewAnimName = oldName => {
    let newName = '';
    const oldAnimNamePrefixInd = oldName.indexOf(appInterface.imageName);
    if (oldAnimNamePrefixInd > -1) {
      newName = oldName.slice(
        oldAnimNamePrefixInd + appInterface.imageName.length
      );
      while (newName[0] === '_') {
        newName = newName.slice(1);
      }
    }
    newName = selectedSpritesheet + '_' + newName;
    return newName;
  };

  const options = Object.keys(display.pictures)
    .filter(imageName => {
      return imageName !== 'invisible';
    })
    .sort((a, b) => {
      return a.toUpperCase() < b.toUpperCase() ? -1 : 1;
    })
    .map(imageName => (
      <option key={imageName} value={imageName}>
        {imageName}
      </option>
    ));

  return (
    <Dialog
      open={!!open}
      title="Copy Animations To Other"
      onConfirm={() => {
        if (completedArr) {
          setCompletedArr(null);
          setOpen(false);
          appInterface.setAnimation(null);
          appInterface.setImageName(selectedSpritesheet);
        } else {
          onConfirm();
        }
      }}
      onCancel={
        completedArr
          ? undefined
          : () => {
              setCompletedArr(null);
              setOpen(false);
            }
      }
      content={
        <>
          {completedArr ? (
            <div>
              <div>Copied The Following:</div>
              {completedArr.map(name => {
                return <div key={name}>- {name}</div>;
              })}
              {completedArr.length === 0 ? 'No animations were copied.' : null}
            </div>
          ) : null}
          {!completedArr ? (
            <div style={{ margin: '5px' }}>
              <div> Select Spritesheet </div>
              <select
                onChange={ev => {
                  setSelectedSpritesheet(ev.target.value);
                }}
              >
                {options}
              </select>
            </div>
          ) : null}
        </>
      }
    />
  );
};

const RenameDialog = ({ open, setOpen, appInterface }) => {
  const animName = open;
  const [newAnimName, setNewAnimName] = React.useState(animName);
  const [errorText, setErrorText] = React.useState('');

  React.useEffect(() => {
    setNewAnimName(animName);
  }, [setNewAnimName, animName]);

  const validate = value => {
    const hasAnim = display.hasAnimation(value);
    if (hasAnim) {
      setErrorText('An animation with that name already exists.');
    } else {
      setErrorText('');
    }
    return hasAnim;
  };

  const onConfirm = async () => {
    setOpen(false);
    appInterface.setAnimation(null);
    const anim = display.getAnimation(animName);
    const imageName = display.getImageFromAnimName(animName);
    if (imageName) {
      const pic = display.pictures[imageName];
      const i = pic.animations.indexOf(animName);
      pic.animations.splice(i, 1, newAnimName);
    }
    delete display.animations[animName];
    anim.name = newAnimName;
    display.updateAnimation(anim, null, anim.loop, anim.sprites);
    appInterface.setAnimation(display.getAnimation(newAnimName));
  };

  return (
    <Dialog
      open={!!open}
      title="Rename Animation"
      onConfirm={onConfirm}
      onCancel={() => {
        setOpen(false);
      }}
      content={
        <>
          <div style={{ margin: '5px' }}>
            <Input
              focus={true}
              width="300"
              name="animationNameRename"
              label="Animation Name"
              errorText={errorText}
              value={newAnimName}
              onKeyDown={ev => {
                if (ev.which === 13) {
                  onConfirm();
                } else if (ev.which === 27) {
                  setOpen(false);
                }
              }}
              onChange={ev => {
                setNewAnimName(ev.target.value);
                validate(ev.target.value);
              }}
            />
          </div>
        </>
      }
    />
  );
};

const DeleteConfirm = ({ open, setOpen, appInterface }) => {
  const animName = open;

  const onConfirm = async () => {
    setOpen(false);
    const imageName = display.getImageFromAnimName(animName);
    if (imageName) {
      const pic = display.pictures[imageName];
      const i = pic.animations.indexOf(animName);
      pic.animations.splice(i, 1);
    }
    display.animations[animName] = null;

    appInterface.setAnimation(null);
  };

  return (
    <Dialog
      open={!!open}
      title="Delete Animation"
      onConfirm={onConfirm}
      onCancel={() => {
        setOpen(false);
      }}
      content={
        <>
          <div>Are you sure you wish to delete the animation '{animName}'?</div>
          <div style={{ margin: '5px' }}></div>
        </>
      }
    />
  );
};

const CreateAnimDialog = ({ open, setOpen, appInterface }) => {
  const [animName, setAnimName] = React.useState(appInterface.imageName || '');
  const [errorText, setErrorText] = React.useState('');

  React.useEffect(() => {
    setAnimName(appInterface.imageName);
  }, [setAnimName, appInterface.imageName]);

  const validate = value => {
    const hasAnim = display.hasAnimation(value);
    if (hasAnim) {
      setErrorText('An animation with that name already exists.');
    } else {
      setErrorText('');
    }
    return hasAnim;
  };

  const onConfirm = async () => {
    const isInvalid = validate(animName);
    if (isInvalid) {
      return;
    }
    appInterface.clearMarkedFrames();
    setOpen(false);
    setAnimName(appInterface.imageName);
    display.createAnimation(animName, appInterface.imageName, () => {
      let a = new Animation(true, display);
      a.name = animName;
      return a;
    });
    appInterface.setAnimation(display.getAnimation(animName));

    setTimeout(() => {
      const elem = document.getElementById('anim-cards-area');
      elem.scrollTop += 999999;
    }, 100);
  };

  return (
    <Dialog
      open={open}
      title="Create New Animation"
      onConfirm={onConfirm}
      onCancel={() => {
        setOpen(false);
      }}
      content={
        <>
          <div>Specify a name for this animation.</div>
          <div style={{ margin: '5px' }}>
            <Input
              focus={true}
              width="140"
              name="animationName"
              label="Animation Name"
              errorText={errorText}
              value={animName}
              onKeyDown={ev => {
                if (ev.which === 13) {
                  onConfirm();
                } else if (ev.which === 27) {
                  setOpen(false);
                }
              }}
              onChange={ev => {
                setAnimName(ev.target.value);
                validate(ev.target.value);
              }}
            />
          </div>
        </>
      }
    />
  );
};

const AnimationItem = ({
  i,
  anim,
  appInterface,
  setDeleteConfirmOpen,
  setRenameAnimDialogOpen,
}) => {
  const ref = React.useRef(null);
  const spriteName = anim.getFirstSpriteName();
  const isSelected = appInterface.animation
    ? appInterface.animation.name === anim.name
    : false;
  const { imageName } = appInterface;
  const { animations } = display.pictures[imageName] || { animations: [] };
  React.useEffect(() => {
    if (spriteName) {
      display.setCanvas(ref.current);
      display.clearScreen();
      const sprite = display.getSprite(spriteName);
      if (sprite) {
        let scale = 1;
        let w = sprite.clip_w;
        let h = sprite.clip_h;
        if (w < 48 && h < 48) {
          scale = 2;
        } else if (w > 96 && h > 96) {
          scale = 1 / (Math.max(w, h) / 64);
        }
        display.drawSprite(spriteName, 32, 32, {
          centered: true,
          scale,
          // width: 64,
          // height: 64,
        });
        display.restoreCanvas();
      }
    }
  }, [spriteName]);

  const handleCadenceClick = () => {
    anim.isCadence = !anim.isCadence;
    display.updateAnimation(anim, null, anim.loop, anim.sprites);
    appInterface.setAnimation(display.getAnimation(anim.name));
  };

  const handleDuplicateClick = () => {
    let animName = anim.name;
    do {
      animName += '_copy';
    } while (display.hasAnimation(animName));
    appInterface.clearMarkedFrames();

    const { loop, isCadence } = anim;
    const sprites = anim.sprites.slice(0);
    display.createAnimation(
      animName,
      appInterface.imageName,
      () => {
        let a = new Animation(loop, display);
        a.name = animName;
        a.isCadence = isCadence;
        sprites.forEach(obj => {
          a.addSprite({
            name: obj.name,
            duration: obj.durationMs,
            opacity: obj.opacity,
            offsetX: obj.offsetX,
            offsetY: obj.offsetY,
          });
        });
        return a;
      },
      i + 1
    );

    setTimeout(() => {
      const elem = document.getElementById('anim-cards-area');
      elem.scrollTop += 100;
    }, 100);

    // appInterface.setAnimation(display.getAnimation(animName));
  };

  return (
    <>
      <div
        className="button hover-bright"
        onClick={() => {
          if (isSelected) {
            // appInterface.setAnimation(null);
          } else {
            appInterface.setAnimation(anim);
            appInterface.clearMarkedFrames();
          }
        }}
        style={{
          // height: 64,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '5px',
          padding: '4px',
          backgroundColor: isSelected
            ? anim.isCadence
              ? colors.darkPurple
              : colors.darkGreen
            : anim.isCadence
            ? colors.darkerPurple
            : null,
          borderColor: isSelected ? colors.green : null,
        }}
      >
        <div
          style={{
            width: '90%',
            overflow: 'hidden',
            whiteSpace: 'pre-wrap',
            textOverflow: 'ellipsis',
            textAlign: 'left',
          }}
        >
          <Text
            type="body-ellipsis"
            noSelect={true}
            ownLine={true}
            lineHeight={5}
            style={{
              padding: '5px',
              overflow: 'hidden',
              direction: 'rtl',
              textAlign: 'left',
              textOverflow: 'ellipsis',
              wordBreak: 'break-all',
              whiteSpace: 'pre',
            }}
          >
            {anim.name}
          </Text>
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  marginLeft: '8px',
                }}
              >
                <Dropdown
                  buttonText={<span>▼</span>}
                  style={{
                    padding: '4px',
                    minWidth: '20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      flexDirection: 'column',
                    }}
                  >
                    <Button
                      style={{ width: '120px', textAlign: 'left' }}
                      type="cancel"
                      onClick={() => {
                        setDeleteConfirmOpen(anim.name);
                      }}
                    >
                      X Delete
                    </Button>
                    <Button
                      style={{ width: '120px', textAlign: 'left' }}
                      type="secondary"
                      onClick={() => {
                        setRenameAnimDialogOpen(anim.name);
                      }}
                    >
                      * Rename
                    </Button>
                    <Button
                      style={{ width: '120px', textAlign: 'left' }}
                      type="secondary"
                      onClick={handleDuplicateClick}
                    >
                      + Duplicate
                    </Button>
                    <Button
                      disabled={anim.sprites.length !== 3}
                      style={{ width: '120px', textAlign: 'left' }}
                      type={anim.isCadence ? 'secondary' : 'cadence'}
                      onClick={handleCadenceClick}
                    >
                      ♫ {anim.isCadence ? 'To Anim' : 'To Cadence'}
                    </Button>
                  </div>
                </Dropdown>
              </div>
              <div
                style={{
                  marginLeft: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button
                    style={{
                      margin: '2px',
                      fontSize: '10px',
                      padding: '2px',
                    }}
                    type="primary"
                    onClick={() => {
                      display.changeAnimationOrder(animations, i, 'up');
                      appInterface.render();
                    }}
                  >
                    ↑ Move UP
                  </Button>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    // width: '164px',
                  }}
                >
                  <Button
                    style={{
                      margin: '2px',
                      fontSize: '10px',
                      padding: '2px',
                    }}
                    type="primary"
                    onClick={() => {
                      display.changeAnimationOrder(animations, i, 'dn');
                      appInterface.render();
                    }}
                  >
                    ↓ Move DN
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <canvas
          style={{ margin: '5px' }}
          ref={ref}
          width={64}
          height={64}
        ></canvas>
      </div>
    </>
  );
};

const AnimationSelect = ({ appInterface }) => {
  const [createAnimDialogOpen, setCreateAnimDialogOpen] = React.useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [renameAnimDialogOpen, setRenameAnimDialogOpen] = React.useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = React.useState(false);
  const [filter, setFilter] = React.useState('');
  const { imageName } = appInterface;
  const { animations } = display.pictures[imageName] || { animations: [] };
  const anims = animations
    .filter(animName => {
      if (filter) {
        return animName.includes(filter);
      } else {
        return true;
      }
    })
    .map(animName => display.getAnimation(animName));

  return (
    <div>
      <div
        style={{
          borderBottom: '1px solid ' + colors.grey,
          paddingTop: '5px',
          paddingBottom: '6px',
        }}
      >
        <Text type="title" ownLine={true} centered={true}>
          Animations
        </Text>
      </div>
      {imageName ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '5px',
            borderBottom: '1px solid ' + colors.grey,
          }}
        >
          <Button
            type="primary"
            onClick={() => {
              setCreateAnimDialogOpen(true);
            }}
          >
            + Anim
          </Button>
          <div>
            {' '}
            <Input
              focus={true}
              width="178"
              name="animFilter"
              label="Filter"
              inputStyle={{
                width: '170px',
              }}
              value={filter}
              onChange={ev => {
                setFilter(ev.target.value);
              }}
            />
          </div>
          <Dropdown>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                flexDirection: 'column',
              }}
            >
              <Button
                type="cadence"
                style={{
                  width: '120px',
                }}
                onClick={() => {
                  setDuplicateDialogOpen(true);
                }}
              >
                + Cp Other
              </Button>
              <Button
                type="secondary"
                style={{
                  width: '120px',
                }}
                onClick={() => {
                  const newAnimations = animations.sort();
                  for (let i = 0; i < animations.length; i++) {
                    animations[i] = newAnimations[i];
                  }
                  appInterface.render();
                }}
              >
                ↑ ASC Sort
              </Button>
              <Button
                type="secondary"
                style={{
                  width: '120px',
                }}
                onClick={() => {
                  const newAnimations = animations.sort().reverse();
                  for (let i = 0; i < animations.length; i++) {
                    animations[i] = newAnimations[i];
                  }
                  appInterface.render();
                }}
              >
                ↓ DSC Sort
              </Button>
            </div>
          </Dropdown>
        </div>
      ) : null}
      <div
        id="anim-cards-area"
        style={{
          height: 'calc(100% - 107px)',
          overflowY: 'auto',
          overflowX: 'hidden',
          margin: !imageName ? '5px' : null,
        }}
      >
        {!imageName ? (
          <Text type="body" ownLine={true} color={colors.grey}>
            Select a spritesheet to see a list of animations.
          </Text>
        ) : null}
        {anims.map((anim, i) => {
          return (
            <AnimationItem
              key={anim.name}
              i={i}
              anim={anim}
              appInterface={appInterface}
              setDeleteConfirmOpen={setDeleteConfirmOpen}
              setRenameAnimDialogOpen={setRenameAnimDialogOpen}
            />
          );
        })}
      </div>
      <CreateAnimDialog
        open={createAnimDialogOpen}
        setOpen={setCreateAnimDialogOpen}
        appInterface={appInterface}
      />
      <DeleteConfirm
        open={deleteConfirmOpen}
        setOpen={setDeleteConfirmOpen}
        appInterface={appInterface}
      />
      <RenameDialog
        open={renameAnimDialogOpen}
        setOpen={setRenameAnimDialogOpen}
        appInterface={appInterface}
      />
      <DuplicateToOtherDialog
        open={duplicateDialogOpen}
        setOpen={setDuplicateDialogOpen}
        appInterface={appInterface}
      />
    </div>
  );
};

export default AnimationSelect;
