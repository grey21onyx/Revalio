import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Chip, IconButton, Tooltip, Grid, Typography } from '@mui/material';
import { 
  AccessTime as TimeIcon, 
  BookmarkBorder as BookmarkIcon, 
  Bookmark as BookmarkedIcon,
  Star as StarIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import Card from '../common/Card';

const difficultyColorMap = {
  'VERY_EASY': 'success',
  'EASY': 'success',
  'MODERATE': 'warning',
  'DIFFICULT': 'error',
  'VERY_DIFFICULT': 'error'
};

const difficultyLabelMap = {
  'VERY_EASY': 'Sangat Mudah',
  'EASY': 'Mudah',
  'MODERATE': 'Sedang',
  'DIFFICULT': 'Sulit',
  'VERY_DIFFICULT': 'Sangat Sulit'
};

const TutorialCard = ({
  id,
  title,
  description,
  imageUrl,
  difficulty,
  estimasiWaktu,
  rating,
  jenisTutorial,
  isCompleted = false,
  isSaved = false,
  onToggleSave,
  sx = {}
}) => {
  const navigate = useNavigate();

  // Format waktu (dari menit)
  const formatWaktu = (menit) => {
    if (menit < 60) {
      return `${menit} menit`;
    } else {
      const jam = Math.floor(menit / 60);
      const sisaMenit = menit % 60;
      return sisaMenit > 0 
        ? `${jam} jam ${sisaMenit} menit` 
        : `${jam} jam`;
    }
  };

  // Generate stars untuk rating
  const renderRating = () => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        {[...Array(5)].map((_, i) => (
          <StarIcon 
            key={i} 
            sx={{ 
              fontSize: 18, 
              color: i < rating ? 'gold' : 'grey.400'
            }} 
          />
        ))}
        <Typography variant="body2" sx={{ ml: 0.5 }}>
          ({rating})
        </Typography>
      </Box>
    );
  };

  // Actions untuk card
  const cardActions = (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Tooltip title={isCompleted ? 'Telah Dicoba' : 'Belum Dicoba'}>
          <Chip
            size="small"
            icon={<AssignmentIcon />}
            label={isCompleted ? 'Telah Dicoba' : 'Belum Dicoba'}
            color={isCompleted ? 'success' : 'default'}
            variant={isCompleted ? 'filled' : 'outlined'}
          />
        </Tooltip>
      </Grid>
      <Grid item>
        <Tooltip title={isSaved ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}>
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave && onToggleSave(id);
            }}
          >
            {isSaved ? <BookmarkedIcon color="primary" /> : <BookmarkIcon />}
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );

  return (
    <Card
      title={title}
      description={description}
      image={imageUrl}
      imageAlt={`Tutorial ${title}`}
      imageHeight={180}
      actions={cardActions}
      onClick={() => navigate(`/daur-ulang/${id}`)}
      sx={sx}
    >
      <Box sx={{ mt: 2, mb: 2 }}>
        <Grid container spacing={1}>
          <Grid item>
            <Chip
              size="small"
              label={jenisTutorial === 'daur ulang' ? 'Daur Ulang' : 'Reuse'}
              color={jenisTutorial === 'daur ulang' ? 'primary' : 'secondary'}
              variant="filled"
            />
          </Grid>
          <Grid item>
            <Chip
              size="small"
              label={difficultyLabelMap[difficulty]}
              color={difficultyColorMap[difficulty]}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <TimeIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
        <Typography variant="body2" color="text.secondary">
          {formatWaktu(estimasiWaktu)}
        </Typography>
      </Box>

      {renderRating()}
    </Card>
  );
};

TutorialCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  difficulty: PropTypes.oneOf(['VERY_EASY', 'EASY', 'MODERATE', 'DIFFICULT', 'VERY_DIFFICULT']).isRequired,
  estimasiWaktu: PropTypes.number.isRequired,
  rating: PropTypes.number.isRequired,
  jenisTutorial: PropTypes.oneOf(['daur ulang', 'reuse']).isRequired,
  isCompleted: PropTypes.bool,
  isSaved: PropTypes.bool,
  onToggleSave: PropTypes.func,
  sx: PropTypes.object
};

export default TutorialCard;
