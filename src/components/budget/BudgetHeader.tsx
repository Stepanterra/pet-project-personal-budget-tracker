import React from 'react';
import { Box, Typography, IconButton, Avatar } from '@mui/material';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  GetApp as GetAppIcon,
  Help as HelpIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Gavel as LegalIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

const BudgetHeader: React.FC = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      px: 2, 
      py: 2, 
      borderBottom: 1, 
      borderColor: 'divider', 
      flexShrink: 0 
    }}>
      <Typography 
        variant="h4" 
        component="h1" 
        color="primary" 
        sx={{ 
          fontWeight: 'bold',
          fontSize: { xs: '1.5rem', sm: '2.125rem' }
        }}
      >
        Personal Budget Tracker
      </Typography>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton size="large" sx={{ p: 0 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44, fontSize: '1.1rem', fontWeight: 'bold' }}>
              SK
            </Avatar>
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 p-4">
          <Box className="flex flex-col items-center mb-4">
            <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, fontSize: '1.5rem', fontWeight: 'bold', mb: 2 }}>
              SK
            </Avatar>
            <Typography variant="h6" className="font-medium text-center">
              Stepan Kos
            </Typography>
          </Box>
          
          <DropdownMenuItem className="py-3 px-4 cursor-pointer">
            <GetAppIcon className="mr-3 h-4 w-4" />
            <Box>
              <Typography variant="body2" className="font-medium">
                Get Access to Our Data
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Request API access to effortlessly integrate our data into your local system.
              </Typography>
            </Box>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="py-3 px-4 cursor-pointer">
            <HelpIcon className="mr-3 h-4 w-4" />
            <Box>
              <Typography variant="body2" className="font-medium">
                Can't find your data?
              </Typography>
              <Typography variant="caption" color="text.secondary">
                We'll help you find the data you need.
              </Typography>
            </Box>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="py-3 px-4 cursor-pointer">
            <NotificationsIcon className="mr-3 h-4 w-4" />
            <Typography variant="body2">Notification settings</Typography>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="py-3 px-4 cursor-pointer">
            <LanguageIcon className="mr-3 h-4 w-4" />
            <Typography variant="body2">English</Typography>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="py-3 px-4 cursor-pointer">
            <LegalIcon className="mr-3 h-4 w-4" />
            <Typography variant="body2">Legal</Typography>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="py-3 px-4 cursor-pointer text-red-600">
            <LogoutIcon className="mr-3 h-4 w-4" />
            <Typography variant="body2">Log out</Typography>
          </DropdownMenuItem>
          
          <Box className="mt-4 pt-3 border-t text-center">
            <Typography variant="caption" color="text.secondary">
              Copyrights 2025
            </Typography>
          </Box>
        </DropdownMenuContent>
      </DropdownMenu>
    </Box>
  );
};

export default BudgetHeader;