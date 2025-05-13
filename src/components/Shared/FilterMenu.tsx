import { Check } from '@mui/icons-material';
import FilterList from '@mui/icons-material/FilterList';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

interface IFilterMenu {
  name: string;
  onFilterChange: (selectedOption: string) => void;
  items: string[];
  selectedItem?: string;
}

export const FilterMenu = ({
  name,
  onFilterChange,
  items,
  selectedItem,
}: IFilterMenu) => {
  const defaultClientText = `Select ${name}`;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSelect = (item: string) => () => {
    const isDefaultOptionClick = item === defaultClientText;
    onFilterChange(isDefaultOptionClick ? '' : item);
    handleClose();
  };
  const arrayItems = [defaultClientText, ...items];

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Button
          disabled={!items.length}
          onClick={handleClick}
          variant="outlined"
          size="small"
          sx={{
            height: '36px',
            color: selectedItem
              ? 'rgba(25, 118, 210, 1)'
              : 'rgba(0, 0, 0, 0.87)',
            border: `1px solid ${selectedItem ? 'rgba(25, 118, 210, 1)' : 'rgba(0, 0, 0, 0.12)'}`,
            fontWeight: 500,
            fontSize: '0,875rem',
            lineHeight: '24px',
            letterSpacing: '0.4px',
            textTransform: 'none',
          }}
          endIcon={
            <FilterList
              sx={{
                marginLeft: '1rem',
              }}
            />
          }
        >
          {name} {selectedItem || ''}
        </Button>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {arrayItems.map((item, index) => (
          <MenuItem
            onClick={handleSelect(item)}
            key={`${item}-${index}`}
            disabled={index === 0 && !selectedItem}
          >
            <ListItemIcon>
              {selectedItem === item && (
                <Check
                  fontSize="small"
                  sx={{ color: 'rgba(25, 118, 210, 1)' }}
                />
              )}
            </ListItemIcon>
            <ListItemText
              sx={{
                color:
                  index === 0 && selectedItem
                    ? 'rgba(25, 118, 210, 1)'
                    : 'rgba(0, 0, 0, 0.87)',
              }}
            >
              {index === 0 && selectedItem ? 'Clear filter' : item}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default FilterMenu;
