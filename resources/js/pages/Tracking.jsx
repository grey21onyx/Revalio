import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Tab, 
  Tabs, 
  TextField, 
  MenuItem, 
  Button, 
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Tooltip,
  Zoom,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  FormHelperText,
  Alert,
  AlertTitle,
  LinearProgress,
  FormControl,
  InputLabel,
  CircularProgress,
  Menu,
  MenuItem as MenuItemMUI,
  ListItemIcon,
  ListItemText,
  Badge,
  Avatar,
  Skeleton,
  Collapse
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Swal from 'sweetalert2';
import { 
  Search as SearchIcon,
  DateRange as DateRangeIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterListIcon,
  LockOutlined as LockIcon,
  HelpOutline as HelpIcon,
  InfoOutlined as InfoIcon,
  PhotoCamera as CameraIcon,
  SaveAlt as SaveIcon,
  MonetizationOn as MoneyIcon,
  CheckCircle as CheckCircleIcon,
  MoreVert as MoreVertIcon,
  FileDownload as FileDownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  InsertDriveFile as FileIcon,
  VisibilityOutlined as ViewIcon,
  ClearAll as ClearAllIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import Card from '../components/common/Card';
import { 
  PieChart, Pie, Cell, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer 
} from 'recharts';

// Data dummy untuk demonstrasi tampilan
const dummyWasteTypes = [
  { id: 1, name: 'Botol Plastik', category_id: 1, category_name: 'Plastik' },
  { id: 2, name: 'Kardus', category_id: 2, category_name: 'Kertas' },
  { id: 3, name: 'Kaleng Aluminium', category_id: 4, category_name: 'Logam' },
  { id: 4, name: 'Botol Kaca', category_id: 3, category_name: 'Kaca' },
  { id: 5, name: 'Baterai Bekas', category_id: 5, category_name: 'Elektronik' },
];

const dummyWasteRecords = [
  { id: 1, waste_id: 1, waste_name: 'Botol Plastik', category_name: 'Plastik', jumlah: 5, satuan: 'kg', tanggal_pencatatan: '2023-05-01', status_pengelolaan: 'disimpan', nilai_estimasi: 15000, catatan: 'Botol bekas air mineral' },
  { id: 2, waste_id: 2, waste_name: 'Kardus', category_name: 'Kertas', jumlah: 3, satuan: 'kg', tanggal_pencatatan: '2023-05-03', status_pengelolaan: 'dijual', nilai_estimasi: 9000, catatan: 'Kardus bekas paket' },
  { id: 3, waste_id: 3, waste_name: 'Kaleng Aluminium', category_name: 'Logam', jumlah: 1.5, satuan: 'kg', tanggal_pencatatan: '2023-05-05', status_pengelolaan: 'didaur ulang', nilai_estimasi: 22500, catatan: 'Kaleng minuman' },
  { id: 4, waste_id: 1, waste_name: 'Botol Plastik', category_name: 'Plastik', jumlah: 2, satuan: 'kg', tanggal_pencatatan: '2023-05-10', status_pengelolaan: 'disimpan', nilai_estimasi: 6000, catatan: 'Botol shampo' },
  { id: 5, waste_id: 4, waste_name: 'Botol Kaca', category_name: 'Kaca', jumlah: 4, satuan: 'kg', tanggal_pencatatan: '2023-05-12', status_pengelolaan: 'dijual', nilai_estimasi: 12000, catatan: 'Botol kecap dan saus' },
];

const statusOptions = ['disimpan', 'dijual', 'didaur ulang'];
const satuanOptions = ['kg', 'liter', 'pcs'];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const generateChartData = (records) => {
  // Data untuk chart kategori (pie chart)
  const categoryData = records.reduce((acc, record) => {
    const category = record.category_name;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += record.jumlah;
    return acc;
  }, {});

  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

  // Data untuk chart tren waktu (line chart)
  const dateData = {};
  records.forEach(record => {
    const date = record.tanggal_pencatatan;
    if (!dateData[date]) {
      dateData[date] = 0;
    }
    dateData[date] += record.jumlah;
  });

  const timelineData = Object.entries(dateData)
    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
    .map(([date, value]) => ({ date, value }));

  return { pieData, timelineData };
};

// Menambahkan data untuk panduan pengguna
const userGuideSteps = [
  {
    label: 'Dashboard',
    description: 'Dashboard menampilkan ringkasan dan statistik dari sampah yang kamu kelola. Kamu bisa melihat total nilai ekonomis dan jumlah sampah, serta grafik komposisi dan tren pengumpulan sampah.',
    image: '/assets/images/guide/dashboard.png'
  },
  {
    label: 'Catat Sampah',
    description: 'Pada tab ini kamu bisa mencatat sampah baru yang telah dikumpulkan. Isi semua data yang diperlukan seperti jenis sampah, jumlah, tanggal dan status pengelolaan.',
    image: '/assets/images/guide/tracking.png'
  },
  {
    label: 'Riwayat Pencatatan',
    description: 'Tab ini menampilkan semua riwayat sampah yang telah kamu catat. Kamu bisa mencari, memfilter, dan mengelola catatan sampah yang sudah ada.',
    image: '/assets/images/guide/history.png'
  },
  {
    label: 'Fitur Filter & Pencarian',
    description: 'Gunakan fitur filter dan pencarian untuk menemukan catatan sampah tertentu berdasarkan jenis, status, tanggal atau kata kunci yang kamu cari.',
    image: '/assets/images/guide/filter.png'
  }
];

// Nilai estimasi per kg untuk tiap jenis sampah (dalam Rupiah)
const wasteValueEstimates = {
  1: 3000, // Botol Plastik: Rp 3000/kg
  2: 2000, // Kardus: Rp 2000/kg
  3: 15000, // Kaleng Aluminium: Rp 15000/kg
  4: 1000, // Botol Kaca: Rp 1000/kg
  5: 5000, // Baterai Bekas: Rp 5000/kg
};

// Informasi panduan untuk setiap jenis sampah
const wasteInfoGuide = {
  1: {
    tips: "Pastikan botol plastik sudah bersih dan kering sebelum ditimbang.",
    impact: "Mendaur ulang 1 kg botol plastik menghemat 1.5 kg CO2."
  },
  2: {
    tips: "Lipat kardus menjadi datar untuk memudahkan penyimpanan.",
    impact: "Mendaur ulang 1 kg kardus menyelamatkan 17 batang pohon."
  },
  3: {
    tips: "Kaleng sebaiknya dibilas terlebih dahulu untuk menghindari bau.",
    impact: "Daur ulang kaleng menghemat 95% energi dibanding produksi baru."
  },
  4: {
    tips: "Hati-hati saat mengumpulkan botol kaca yang pecah.",
    impact: "Kaca bisa didaur ulang 100% tanpa kehilangan kualitas."
  },
  5: {
    tips: "Simpan baterai di wadah khusus dan hindari kontak dengan air.",
    impact: "Baterai mengandung bahan berbahaya yang bisa mencemari tanah."
  }
};

const Tracking = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [wasteTypeFilter, setWasteTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRangeStart, setDateRangeStart] = useState(null);
  const [dateRangeEnd, setDateRangeEnd] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredRecords, setFilteredRecords] = useState(dummyWasteRecords);
  const [chartData, setChartData] = useState({
    pieData: [],
    timelineData: []
  });

  // State untuk form tambah catatan
  const [formData, setFormData] = useState({
    waste_id: '',
    jumlah: '',
    satuan: 'kg',
    tanggal_pencatatan: new Date(),
    status_pengelolaan: 'disimpan',
    catatan: '',
    foto: null
  });

  // State for tour/guide
  const [showGuide, setShowGuide] = useState(false);
  const [currentGuideStep, setCurrentGuideStep] = useState(0);
  
  // Help tooltip visibility state
  const [helpTooltip, setHelpTooltip] = useState({
    dashboard: false,
    tracking: false,
    history: false
  });

  // Menambahkan state untuk dialog panduan
  const [openGuideDialog, setOpenGuideDialog] = useState(false);

  // State untuk validasi dan nilai ekonomis
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [estimatedValue, setEstimatedValue] = useState(0);
  const [showWasteInfo, setShowWasteInfo] = useState(false);

  // State untuk menu opsi dan dialog konfirmasi
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogAction, setConfirmDialogAction] = useState('');
  const [isLoading, setIsLoading] = useState({
    delete: false,
    edit: false,
    export: false
  });
  const [exportMenuAnchorEl, setExportMenuAnchorEl] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // State untuk dialog konfirmasi hapus
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for collapsible form in Pencatatan tab
  const [formExpanded, setFormExpanded] = useState(false);

  useEffect(() => {
    // Filter records berdasarkan pencarian dan filter
    const filtered = dummyWasteRecords.filter(record => {
      const matchesSearch = record.waste_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           record.catatan.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesWasteType = wasteTypeFilter === '' || record.waste_id === parseInt(wasteTypeFilter);
      const matchesStatus = statusFilter === '' || record.status_pengelolaan === statusFilter;
      
      const recordDate = new Date(record.tanggal_pencatatan);
      const matchesDateStart = !dateRangeStart || recordDate >= dateRangeStart;
      const matchesDateEnd = !dateRangeEnd || recordDate <= dateRangeEnd;
      
      return matchesSearch && matchesWasteType && matchesStatus && matchesDateStart && matchesDateEnd;
    });

    setFilteredRecords(filtered);
    setChartData(generateChartData(filtered));
  }, [searchQuery, wasteTypeFilter, statusFilter, dateRangeStart, dateRangeEnd]);

  const handleTabChange = (event, newValue) => {
    // If switching to Pencatatan tab from tab 2 (old Riwayat Pencatatan), set formExpanded to false
    if (tabValue === 2 && newValue === 1) {
      setFormExpanded(false);
    }
    // If switching to Pencatatan tab from tab 1 (old Catat Sampah), set formExpanded to true
    else if (tabValue === 1 && newValue === 1) {
      setFormExpanded(true);
    }
    
    setTabValue(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleDateChange = (newDate) => {
    setFormData(prev => ({
      ...prev,
      tanggal_pencatatan: newDate
    }));
  };

  // Tambahan useEffect untuk menghitung estimasi nilai ekonomis
  useEffect(() => {
    if (formData.waste_id && formData.jumlah) {
      const wasteId = parseInt(formData.waste_id);
      const amount = parseFloat(formData.jumlah);
      
      if (wasteValueEstimates[wasteId] && !isNaN(amount)) {
        const estimated = wasteValueEstimates[wasteId] * amount;
        setEstimatedValue(estimated);
      } else {
        setEstimatedValue(0);
      }
    } else {
      setEstimatedValue(0);
    }
  }, [formData.waste_id, formData.jumlah]);

  // Function untuk validasi form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.waste_id) {
      errors.waste_id = "Jenis sampah harus dipilih";
    }
    
    if (!formData.jumlah) {
      errors.jumlah = "Jumlah harus diisi";
    } else if (parseFloat(formData.jumlah) <= 0) {
      errors.jumlah = "Jumlah harus lebih dari 0";
    }
    
    if (!formData.tanggal_pencatatan) {
      errors.tanggal_pencatatan = "Tanggal pencatatan harus diisi";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Function to toggle waste info display
  const toggleWasteInfo = () => {
    setShowWasteInfo(prev => !prev);
  };

  // Modifikasi handleFormSubmit untuk validasi
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulasikan pengiriman data ke server
      setTimeout(() => {
        console.log("Form submitted:", formData);
        setIsSubmitting(false);
        setSubmitSuccess(true);
        
        // Reset form setelah beberapa detik
        setTimeout(() => {
          setSubmitSuccess(false);
          setFormData({
            waste_id: '',
            jumlah: '',
            satuan: 'kg',
            tanggal_pencatatan: new Date(),
            status_pengelolaan: 'disimpan',
            catatan: '',
            foto: null
          });
          setEstimatedValue(0);
        }, 3000);
      }, 1500);
    }
  };

  // Menghitung total nilai estimasi dan berat total
  const totalNilai = filteredRecords.reduce((sum, record) => sum + record.nilai_estimasi, 0);
  const totalBerat = filteredRecords.reduce((sum, record) => sum + record.jumlah, 0);

  // Fungsi untuk menangani klik login
  const handleLoginClick = () => {
    navigate('/login', { state: { from: '/tracking' } });
  };

  // Handler untuk dialog panduan
  const handleOpenGuideDialog = () => {
    setOpenGuideDialog(true);
  };

  const handleCloseGuideDialog = () => {
    setOpenGuideDialog(false);
  };

  // Memodifikasi handler untuk bantuan
  const handleOpenGuide = () => {
    handleOpenGuideDialog();
  };
  
  // Handler for tooltip visibility
  const handleTooltipVisibility = (section, isVisible) => {
    setHelpTooltip(prev => ({
      ...prev,
      [section]: isVisible
    }));
  };

  // Handlers untuk menu opsi
  const handleMenuOpen = (event, record) => {
    setAnchorEl(event.currentTarget);
    setSelectedRecord(record);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handlers untuk menu ekspor
  const handleExportMenuOpen = (event) => {
    setExportMenuAnchorEl(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportMenuAnchorEl(null);
  };

  // Handler untuk dialog konfirmasi
  const handleConfirmDialogOpen = (action) => {
    setConfirmDialogAction(action);
    setConfirmDialogOpen(true);
    handleMenuClose();
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  // Handler untuk aksi pada record
  const handleRecordAction = () => {
    if (!selectedRecord) return;

    if (confirmDialogAction === 'delete') {
      setIsLoading(prev => ({ ...prev, delete: true }));
      
      // Simulasi penghapusan data
      setTimeout(() => {
        const newRecords = filteredRecords.filter(r => r.id !== selectedRecord.id);
        setFilteredRecords(newRecords);
        setIsLoading(prev => ({ ...prev, delete: false }));
        setConfirmDialogOpen(false);
        
        // Tampilkan notifikasi berhasil
        Swal.fire({
          title: 'Berhasil!',
          text: 'Data sampah telah dihapus',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }, 1000);
    } else if (confirmDialogAction === 'edit') {
      // Logika untuk edit akan diimplementasikan nanti
      console.log("Edit record:", selectedRecord);
      setConfirmDialogOpen(false);
    }
  };

  // Handler untuk ekspor data
  const handleExportData = (format) => {
    setIsExporting(true);
    
    // Simulasi ekspor data
    setTimeout(() => {
      console.log(`Exporting data as ${format}`);
      setIsExporting(false);
      
      // Tampilkan notifikasi berhasil
      Swal.fire({
        title: 'Ekspor Berhasil!',
        text: `Data telah diekspor dalam format ${format.toUpperCase()}`,
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      
      handleExportMenuClose();
    }, 1500);
  };

  // Function untuk mendapatkan konfigurasi status
  const getStatusConfig = (status) => {
    const config = {
      'disimpan': {
        color: 'info',
        label: 'Disimpan'
      },
      'dijual': {
        color: 'success',
        label: 'Dijual'
      },
      'didaur ulang': {
        color: 'warning',
        label: 'Didaur Ulang'
      }
    };
    
    return config[status] || { 
      color: 'default', 
      label: status 
    };
  };

  // Function untuk export button dengan badge
  const ExportButton = () => (
    <Button
      variant="outlined"
      startIcon={<FileDownloadIcon />}
      onClick={handleExportMenuOpen}
      sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 } }}
    >
      Ekspor Data
      <Badge 
        color="secondary" 
        badgeContent={filteredRecords.length} 
        max={99}
        sx={{ ml: 1 }}
      />
    </Button>
  );

  // Handler untuk dialog konfirmasi hapus
  const handleDeleteDialogOpen = (record) => {
    setRecordToDelete(record);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  // Handler untuk menghapus record
  const handleDeleteRecord = () => {
    if (!recordToDelete) return;
    
    setIsDeleting(true);
    
    // Simulasi penghapusan data
    setTimeout(() => {
      const newRecords = filteredRecords.filter(r => r.id !== recordToDelete.id);
      setFilteredRecords(newRecords);
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      
      // Tampilkan notifikasi berhasil
      Swal.fire({
        title: 'Berhasil!',
        text: 'Data sampah telah dihapus',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    }, 1000);
  };

  // Handler untuk reset filter
  const handleResetFilters = () => {
    setSearchQuery('');
    setWasteTypeFilter('');
    setStatusFilter('');
    setDateRangeStart(null);
    setDateRangeEnd(null);
  };

  // Toggle form visibility in Pencatatan tab
  const toggleFormExpanded = () => {
    setFormExpanded(prev => !prev);
  };

  // Modify userGuideSteps to reflect the new structure
  const updatedGuideSteps = [
    userGuideSteps[0], // Dashboard
    {
      label: 'Pencatatan',
      description: 'Pada tab ini kamu bisa mencatat sampah baru dan melihat riwayat pencatatan yang sudah ada. Gunakan form di bagian atas untuk menambahkan sampah baru, dan lihat daftar pencatatan di bawah.',
      image: '/assets/images/guide/tracking.png'
    },
    userGuideSteps[3] // Fitur Filter & Pencarian
  ];

  // Perbaiki CustomTooltip komponen untuk memastikan selalu mengembalikan elemen React yang valid
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ bgcolor: 'background.paper', p: 1.5, borderRadius: 1, boxShadow: 1 }}>
          <Typography variant="body2" sx={{ display: 'block' }}>{`${payload[0].name}: ${payload[0].value} kg`}</Typography>
        </Box>
      );
    }
    // Return div kosong daripada null untuk menghindari error children undefined
    return <Box sx={{ display: 'none' }}></Box>;
  };

  // Tambahkan komponen ini untuk Tooltip baris 940
  const LineChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ bgcolor: 'background.paper', p: 1.5, borderRadius: 1, boxShadow: 1 }}>
          <Typography variant="body2" sx={{ display: 'block' }}>{`Tanggal: ${format(new Date(label), 'dd/MM/yyyy')}`}</Typography>
          <Typography variant="body2" sx={{ display: 'block' }}>{`Jumlah: ${payload[0].value} kg`}</Typography>
        </Box>
      );
    }
    return <Box sx={{ display: 'none' }}></Box>;
  };

  // Menampilkan overlay login jika belum terautentikasi, bukan langsung return null
  if (!isAuthenticated) {
    return (
      <Box 
        sx={{ 
          position: 'relative', 
          height: '100vh', 
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa'
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 5, 
            maxWidth: 500, 
            width: '90%',
            textAlign: 'center',
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
          }}
        >
          <LockIcon sx={{ fontSize: 64, mb: 2, color: theme.palette.primary.main }} />
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Fitur Terbatas
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Fitur tracking sampah hanya tersedia untuk pengguna yang sudah login. Silakan login untuk mengakses fitur ini.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleLoginClick}
            sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 600 }}
          >
            Masuk Sekarang
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/')}
            sx={{ ml: 2, px: 4, py: 1.5, borderRadius: 2, fontWeight: 600 }}
          >
            Kembali
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f9f9f9', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        {/* Header Section with Help Button */}
        <Box sx={{ mb: { xs: 3, md: 4 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'flex-start' }, gap: { xs: 2, md: 0 } }}>
          <Box sx={{ width: '100%' }}>
            <Typography 
              variant="h4" 
              component="h1" 
              fontWeight={800} 
              gutterBottom
              sx={{ 
                position: 'relative',
                display: 'inline-block',
                mb: 2,
                fontSize: { xs: '1.75rem', md: '2.125rem' }
              }}
            >
              Tracking Pengelolaan Sampahku
              <Box 
                sx={{ 
                  position: 'absolute',
                  bottom: -5,
                  left: 0,
                  width: '50%',
                  height: 4,
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: 2
                }}
              />
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                mt: 1, 
                maxWidth: '800px',
                fontSize: { xs: '0.95rem', md: '1.1rem' },
                lineHeight: 1.6
              }}
            >
              Pantau dan kelola sampah yang kamu kumpulkan untuk lingkungan yang lebih baik
            </Typography>
          </Box>
          
          {/* Help Button */}
          <Tooltip title="Bantuan penggunaan fitur tracking" arrow>
            <Button 
              variant="outlined" 
              color="primary" 
              startIcon={<HelpIcon />}
              onClick={handleOpenGuide}
              sx={{ mt: { xs: 0, md: 1 }, alignSelf: { xs: 'flex-start', md: 'flex-start' } }}
            >
              Bantuan
            </Button>
          </Tooltip>
        </Box>

        {/* Main Content Tabs with Info Icons - Updated for 2 tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            variant="fullWidth"
          >
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <span>Dashboard</span>
                  <Tooltip 
                    title="Lihat statistik dan tren pengelolaan sampahmu" 
                    arrow
                    open={helpTooltip.dashboard}
                    onOpen={() => handleTooltipVisibility('dashboard', true)}
                    onClose={() => handleTooltipVisibility('dashboard', false)}
                  >
                    <InfoIcon 
                      fontSize="small" 
                      sx={{ ml: 0.5, width: 16, height: 16, cursor: 'help' }}
                      onMouseEnter={() => handleTooltipVisibility('dashboard', true)}
                      onMouseLeave={() => handleTooltipVisibility('dashboard', false)}
                    />
                  </Tooltip>
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <span>Pencatatan</span>
                  <Tooltip 
                    title="Catat dan kelola data sampah yang kamu kumpulkan" 
                    arrow
                    open={helpTooltip.tracking}
                    onOpen={() => handleTooltipVisibility('tracking', true)}
                    onClose={() => handleTooltipVisibility('tracking', false)}
                  >
                    <InfoIcon 
                      fontSize="small" 
                      sx={{ ml: 0.5, width: 16, height: 16, cursor: 'help' }}
                      onMouseEnter={() => handleTooltipVisibility('tracking', true)}
                      onMouseLeave={() => handleTooltipVisibility('tracking', false)}
                    />
                  </Tooltip>
                </Box>
              }
            />
          </Tabs>
        </Box>

        {/* Tab content will remain but need to be updated in subsequent edits */}
        
        {/* Dashboard Tab - no changes needed */}
        {tabValue === 0 && (
          <Box>
            {/* Intro Section */}
            <Paper sx={{ p: 3, mb: 4, borderLeft: `4px solid ${theme.palette.primary.main}` }}>
              <Typography variant="h6" gutterBottom>
                Selamat Datang di Dashboard Tracking Sampah!
              </Typography>
              <Typography variant="body1" paragraph>
                Dashboard ini memberikan gambaran lengkap tentang pengelolaan sampahmu. Pantau nilai ekonomis, jumlah sampah terkelola, dan lihat visualisasi data untuk memahami pola pengelolaan sampahmu.
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                <Chip 
                  label="Pantau Nilai Ekonomis" 
                  variant="outlined" 
                  color="primary" 
                  size="small" 
                />
                <Chip 
                  label="Lihat Komposisi Sampah" 
                  variant="outlined" 
                  color="secondary" 
                  size="small" 
                />
                <Chip 
                  label="Analisis Tren" 
                  variant="outlined" 
                  color="info" 
                  size="small" 
                />
                <Chip 
                  label="Kelola Pencatatan" 
                  variant="outlined" 
                  color="success" 
                  size="small" 
                />
              </Box>
            </Paper>

            {/* Statistik Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Card
                  title="Total Nilai Ekonomis"
                  description={`Estimasi total nilai sampah yang kamu kelola`}
                  sx={{ bgcolor: theme.palette.success.light, color: '#fff' }}
                  descriptionSx={{ color: '#fff' }}
                >
                  <Typography variant="h3" sx={{ mt: 2, fontWeight: 700, color: '#fff' }}>
                    Rp {totalNilai.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.8)' }}>
                    Nilai ini merupakan estimasi berdasarkan harga pasar untuk sampah yang dapat didaur ulang
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card
                  title="Total Sampah Terkelola"
                  description={`Jumlah total sampah yang sudah kamu kelola`}
                  sx={{ bgcolor: theme.palette.info.light, color: '#fff' }}
                  descriptionSx={{ color: '#fff' }}
                >
                  <Typography variant="h3" sx={{ mt: 2, fontWeight: 700, color: '#fff' }}>
                    {totalBerat.toLocaleString()} kg
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.8)' }}>
                    Kontribusimu untuk mengurangi sampah yang terbuang ke lingkungan
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Charts */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                    Komposisi Sampah Berdasarkan Kategori
                  </Typography>
                  <Box sx={{ height: { xs: 260, sm: 300 }, display: 'flex', justifyContent: 'center' }}>
                    {chartData.pieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                          <Pie
                            data={chartData.pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={isMobile ? 60 : 80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            labelStyle={{ fontSize: isMobile ? '0.7rem' : '0.9rem' }}
                          >
                            {chartData.pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Legend layout={isMobile ? 'horizontal' : 'vertical'} verticalAlign={isMobile ? 'bottom' : 'middle'} align={isMobile ? 'center' : 'right'} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                          Tidak ada data untuk ditampilkan
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                    Tren Pengumpulan Sampah
                  </Typography>
                  <Box sx={{ height: { xs: 260, sm: 300 }, display: 'flex', justifyContent: 'center' }}>
                    {chartData.timelineData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={chartData.timelineData}
                          margin={{
                            top: 5,
                            right: isMobile ? 10 : 30,
                            left: isMobile ? 5 : 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={(value) => format(new Date(value), 'dd/MM')}
                            tick={{ fontSize: isMobile ? 10 : 12 }}
                          />
                          <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                          <RechartsTooltip content={<LineChartTooltip />} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="value"
                            name="Jumlah (kg)"
                            stroke={theme.palette.primary.main}
                            activeDot={{ r: isMobile ? 6 : 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                          Tidak ada data untuk ditampilkan
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Combined Pencatatan Tab */}
        {tabValue === 1 && (
          <Box>
            {/* Collapsible Form Card */}
            <Paper sx={{ mb: 4, borderRadius: '8px', overflow: 'hidden' }}>
              <Box 
                sx={{ 
                  p: isMobile ? 1.5 : 2, 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  bgcolor: theme.palette.primary.main,
                  color: 'white'
                }}
                onClick={toggleFormExpanded}
                style={{ cursor: 'pointer' }}
              >
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontSize: { xs: '0.95rem', md: '1.25rem' } }}>
                  <AddIcon sx={{ mr: 1, fontSize: { xs: '1rem', md: '1.5rem' } }} /> Catat Sampah Baru
                </Typography>
                <IconButton size="small" color="inherit">
                  {formExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </Box>
              
              <Collapse in={formExpanded}>
                <Box sx={{ p: 3 }}>
                  {/* Info Alert */}
                  <Alert severity="info" sx={{ mb: 3, fontSize: isMobile ? '0.85rem' : '0.9rem' }}>
                    <AlertTitle sx={{ fontWeight: 600, fontSize: isMobile ? '0.9rem' : '1rem' }}>Tips Pencatatan</AlertTitle>
                    Catatlah sampah segera setelah dikumpulkan untuk pengelolaan yang lebih baik. Jika memungkinkan, tambahkan foto untuk dokumentasi yang lebih lengkap.
                  </Alert>
                  
                  {submitSuccess && (
                    <Alert severity="success" sx={{ mb: 3, fontSize: isMobile ? '0.85rem' : '0.9rem' }}>
                      <AlertTitle sx={{ fontWeight: 600, fontSize: isMobile ? '0.9rem' : '1rem' }}>Berhasil!</AlertTitle>
                      Data sampah berhasil disimpan. Kamu bisa melihatnya di daftar pencatatan di bawah.
                    </Alert>
                  )}
    
                  <form onSubmit={handleFormSubmit}>
                    <Grid container spacing={isMobile ? 2 : 3}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth error={!!formErrors.waste_id}>
                          <TextField
                            label="Jenis Sampah"
                            name="waste_id"
                            select
                            fullWidth
                            value={formData.waste_id}
                            onChange={handleFormChange}
                            required
                            error={!!formErrors.waste_id}
                            helperText={formErrors.waste_id}
                            InputProps={{
                              endAdornment: formData.waste_id && (
                                <InputAdornment position="end">
                                  <Tooltip title="Lihat tips pengelolaan" arrow>
                                    <IconButton 
                                      size="small" 
                                      onClick={toggleWasteInfo}
                                      color={showWasteInfo ? "primary" : "default"}
                                    >
                                      <InfoIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </InputAdornment>
                              )
                            }}
                            sx={{ '& .MuiInputLabel-root': { fontSize: isMobile ? '0.85rem' : 'inherit' } }}
                          >
                            {dummyWasteTypes.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.name} ({option.category_name})
                              </MenuItem>
                            ))}
                          </TextField>
                        </FormControl>
                        
                        {/* Waste Info Guide */}
                        {showWasteInfo && formData.waste_id && (
                          <Paper variant="outlined" sx={{ p: isMobile ? 1.5 : 2, mt: 1, bgcolor: 'rgba(0, 150, 136, 0.05)' }}>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                              Tips untuk {dummyWasteTypes.find(w => w.id === parseInt(formData.waste_id))?.name}:
                            </Typography>
                            <Typography variant="body2" paragraph sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                              {wasteInfoGuide[formData.waste_id]?.tips || "Tidak ada tips khusus."}
                            </Typography>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                              Dampak Lingkungan:
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                              {wasteInfoGuide[formData.waste_id]?.impact || "Informasi dampak tidak tersedia."}
                            </Typography>
                          </Paper>
                        )}
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          label="Jumlah"
                          name="jumlah"
                          type="number"
                          fullWidth
                          value={formData.jumlah}
                          onChange={handleFormChange}
                          required
                          error={!!formErrors.jumlah}
                          helperText={formErrors.jumlah}
                          InputProps={{
                            inputProps: { min: 0, step: 0.1 }
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          label="Satuan"
                          name="satuan"
                          select
                          fullWidth
                          value={formData.satuan}
                          onChange={handleFormChange}
                          required
                        >
                          {satuanOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      
                      {/* Value Estimation Card */}
                      {estimatedValue > 0 && (
                        <Grid item xs={12}>
                          <Paper sx={{ 
                            p: isMobile ? 1.5 : 2, 
                            display: 'flex', 
                            flexDirection: isMobile ? 'column' : 'row',
                            alignItems: isMobile ? 'flex-start' : 'center',
                            bgcolor: 'rgba(76, 175, 80, 0.1)',
                            borderLeft: '4px solid #4caf50'
                          }}>
                            <MoneyIcon sx={{ fontSize: isMobile ? 32 : 40, color: 'success.main', mr: isMobile ? 0 : 2, mb: isMobile ? 1 : 0 }} />
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                                Estimasi Nilai Ekonomis:
                              </Typography>
                              <Typography variant="h6" color="success.main" fontWeight={700} sx={{ fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
                                Rp {estimatedValue.toLocaleString()}
                              </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ ml: isMobile ? 0 : 'auto', color: 'text.secondary', mt: isMobile ? 1 : 0, fontSize: isMobile ? '0.7rem' : '0.75rem' }}>
                              *Estimasi berdasarkan harga pasar
                            </Typography>
                          </Paper>
                        </Grid>
                      )}
                      
                      <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="Tanggal Pencatatan"
                            value={formData.tanggal_pencatatan}
                            onChange={handleDateChange}
                            format="dd/MM/yyyy"
                            slotProps={{ 
                              textField: { 
                                fullWidth: true, 
                                required: true,
                                error: !!formErrors.tanggal_pencatatan,
                                helperText: formErrors.tanggal_pencatatan 
                              } 
                            }}
                          />
                        </LocalizationProvider>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Status Pengelolaan"
                          name="status_pengelolaan"
                          select
                          fullWidth
                          value={formData.status_pengelolaan}
                          onChange={handleFormChange}
                          required
                        >
                          {statusOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                        <FormHelperText>
                          Status saat ini dari sampah yang dikumpulkan
                        </FormHelperText>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          label="Catatan (opsional)"
                          name="catatan"
                          multiline
                          rows={3}
                          fullWidth
                          value={formData.catatan}
                          onChange={handleFormChange}
                          placeholder="Tambahkan detail tentang sampah, lokasi pengumpulan, atau informasi tambahan lainnya"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'flex-start', mt: 1 }}>
                          <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            startIcon={isSubmitting ? <CircularProgress size={isMobile ? 16 : 20} color="inherit" /> : <SaveIcon />}
                            disabled={isSubmitting}
                            size={isMobile ? "medium" : "large"}
                            sx={{ px: isMobile ? 2 : 3, py: isMobile ? 0.75 : 1 }}
                          >
                            {isSubmitting ? 'Menyimpan...' : 'Simpan Catatan'}
                          </Button>
                          
                          <Button
                            variant="outlined"
                            component="label"
                            startIcon={<CameraIcon />}
                            size={isMobile ? "medium" : "large"}
                          >
                            Tambah Foto
                            <input
                              type="file"
                              hidden
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setFormData(prev => ({
                                    ...prev,
                                    foto: e.target.files[0]
                                  }));
                                }
                              }}
                            />
                          </Button>
                          
                          {formData.foto && (
                            <Chip 
                              label={formData.foto.name.length > 15 ? formData.foto.name.substring(0, 15) + '...' : formData.foto.name} 
                              onDelete={() => setFormData(prev => ({ ...prev, foto: null }))}
                              color="primary" 
                              variant="outlined"
                              sx={{ height: isMobile ? 28 : 32, '& .MuiChip-label': { fontSize: isMobile ? '0.75rem' : '0.85rem' } }}
                            />
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </form>
                </Box>
              </Collapse>
            </Paper>

            {/* Header with title and export button */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              mb: 2
            }}>
              <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center', fontSize: { xs: '1rem', md: '1.25rem' }, mb: { xs: 1, sm: 0 } }}>
                <InfoIcon sx={{ mr: 1, fontSize: { xs: '1.2rem', md: '1.5rem' } }} /> Daftar Pencatatan Sampah
                <Chip 
                  label={`${filteredRecords.length} item`} 
                  size="small" 
                  color="primary" 
                  sx={{ ml: 1, height: { xs: 20, sm: 24 }, '& .MuiChip-label': { px: 1, fontSize: isMobile ? '0.65rem' : '0.75rem' } }}
                />
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<ClearAllIcon fontSize={isMobile ? 'small' : 'medium'} />}
                  onClick={handleResetFilters}
                  disabled={!searchQuery && !wasteTypeFilter && !statusFilter && !dateRangeStart && !dateRangeEnd}
                  size={isMobile ? 'small' : 'medium'}
                >
                  {isMobile ? 'Reset' : 'Reset Filter'}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<FileDownloadIcon fontSize={isMobile ? 'small' : 'medium'} />}
                  onClick={handleExportMenuOpen}
                  disabled={filteredRecords.length === 0 || isExporting}
                  size={isMobile ? 'small' : 'medium'}
                >
                  {isExporting ? (
                    <>
                      <CircularProgress size={isMobile ? 16 : 20} color="inherit" sx={{ mr: 1 }} />
                      {isMobile ? 'Ekspor...' : 'Mengekspor...'}
                    </>
                  ) : (
                    <>
                      {isMobile ? 'Ekspor' : 'Ekspor Data'}
                      <Badge 
                        color="secondary" 
                        badgeContent={filteredRecords.length} 
                        max={99}
                        sx={{ ml: 1, '& .MuiBadge-badge': { fontSize: '0.65rem', height: '16px', minWidth: '16px' } }}
                      />
                    </>
                  )}
                </Button>
              </Box>
            </Box>

            {/* Filter and Search */}
            <Paper sx={{ p: isMobile ? 1.5 : 3, mb: 3 }}>
              <Grid container spacing={isMobile ? 1 : 2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Cari"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize={isMobile ? 'small' : 'medium'} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiInputLabel-root': { fontSize: isMobile ? '0.8rem' : 'inherit' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Jenis Sampah"
                    variant="outlined"
                    select
                    size="small"
                    fullWidth
                    value={wasteTypeFilter}
                    onChange={(e) => setWasteTypeFilter(e.target.value)}
                    sx={{ '& .MuiInputLabel-root': { fontSize: isMobile ? '0.8rem' : 'inherit' } }}
                  >
                    <MenuItem value="">Semua</MenuItem>
                    {dummyWasteTypes.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Status"
                    variant="outlined"
                    select
                    size="small"
                    fullWidth
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{ '& .MuiInputLabel-root': { fontSize: isMobile ? '0.8rem' : 'inherit' } }}
                  >
                    <MenuItem value="">Semua</MenuItem>
                    {statusOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Rentang Tanggal"
                      value={dateRangeStart}
                      onChange={(newValue) => setDateRangeStart(newValue)}
                      slotProps={{ 
                        textField: { 
                          size: "small", 
                          fullWidth: true,
                          InputProps: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <DateRangeIcon fontSize={isMobile ? 'small' : 'medium'} />
                              </InputAdornment>
                            )
                          },
                          sx: { '& .MuiInputLabel-root': { fontSize: isMobile ? '0.8rem' : 'inherit' } }
                        } 
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Paper>

            {/* Data Display: Table for Desktop, Cards for Mobile */}
            {isMobile ? (
              <Box>
                {filteredRecords.length === 0 ? (
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <SearchIcon sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.5, mb: 1 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontSize: '1rem' }}>
                      Tidak ada data ditemukan
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.85rem' }}>
                      Coba ubah filter pencarian atau tambahkan catatan sampah baru
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<AddIcon />}
                      onClick={() => setFormExpanded(true)}
                      size="small"
                      sx={{ mt: 1 }}
                    >
                      Tambah Catatan Baru
                    </Button>
                  </Paper>
                ) : (
                  filteredRecords
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((record) => (
                      <Paper key={record.id} sx={{ mb: 2, p: { xs: 1.5, sm: 2 }, borderRadius: '8px', overflow: 'hidden' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold" color="primary.main" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                            {record.waste_name}
                          </Typography>
                          <IconButton 
                            size="small" 
                            color="default"
                            onClick={(e) => handleMenuOpen(e, record)}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            {format(new Date(record.tanggal_pencatatan), 'dd MMM yyyy')}
                          </Typography>
                          
                          <Chip
                            size="small"
                            label={getStatusConfig(record.status_pengelolaan).label}
                            color={getStatusConfig(record.status_pengelolaan).color}
                            sx={{ height: 24, '& .MuiChip-label': { px: 1, fontSize: '0.7rem' } }}
                          />
                        </Box>
                        
                        <Divider sx={{ my: 1 }} />
                        
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Jumlah</Typography>
                            <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.85rem' }}>{record.jumlah} {record.satuan}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Kategori</Typography>
                            <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.85rem' }}>{record.category_name}</Typography>
                          </Grid>
                          <Grid item xs={12} sx={{ mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Nilai Estimasi</Typography>
                            <Typography variant="body1" fontWeight="bold" color="success.main" sx={{ fontSize: '0.9rem' }}>
                              Rp {record.nilai_estimasi.toLocaleString()}
                            </Typography>
                          </Grid>
                          {record.catatan && (
                            <Grid item xs={12} sx={{ mt: 0.5 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Catatan:</Typography>
                              <Tooltip title={record.catatan} arrow>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    maxWidth: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer',
                                    display: 'block'
                                  }}
                                >
                                  {record.catatan}
                                </Typography>
                              </Tooltip>
                            </Grid>
                          )}
                        </Grid>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                          <IconButton 
                            color="primary" 
                            size="small"
                            sx={{ mr: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            size="small"
                            onClick={() => handleDeleteDialogOpen(record)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))
                )}
                
                {filteredRecords.length > 0 && (
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredRecords.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage=""
                    sx={{ 
                      '.MuiTablePagination-toolbar': { pl: 1 },
                      '.MuiTablePagination-displayedRows': { fontSize: '0.8rem' },
                      '.MuiTablePagination-selectLabel': { display: 'none' }
                    }}
                  />
                )}
              </Box>
            ) : (
              <Paper sx={{ borderRadius: '8px', overflow: 'hidden' }}>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} size="medium">
                    <TableHead>
                      <TableRow>
                        <TableCell>Tanggal</TableCell>
                        <TableCell>Jenis Sampah</TableCell>
                        <TableCell>Kategori</TableCell>
                        <TableCell align="right">Jumlah</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Nilai Estimasi</TableCell>
                        <TableCell>Catatan</TableCell>
                        <TableCell align="center">Aksi</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredRecords.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                            <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                              Tidak ada data ditemukan
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              Coba ubah filter pencarian atau tambahkan catatan sampah baru
                            </Typography>
                            <Button 
                              variant="contained" 
                              color="primary" 
                              startIcon={<AddIcon />}
                              onClick={() => setFormExpanded(true)}
                            >
                              Tambah Catatan Baru
                            </Button>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRecords
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((record) => (
                            <TableRow key={record.id} hover>
                              <TableCell>{format(new Date(record.tanggal_pencatatan), 'dd/MM/yyyy')}</TableCell>
                              <TableCell>{record.waste_name}</TableCell>
                              <TableCell>{record.category_name}</TableCell>
                              <TableCell align="right">{record.jumlah} {record.satuan}</TableCell>
                              <TableCell>
                                <Chip
                                  size="small"
                                  label={getStatusConfig(record.status_pengelolaan).label}
                                  color={getStatusConfig(record.status_pengelolaan).color}
                                />
                              </TableCell>
                              <TableCell align="right" sx={{ fontWeight: 700, color: 'success.main' }}>
                                Rp {record.nilai_estimasi.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                {record.catatan ? (
                                  <Tooltip title={record.catatan} arrow>
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        maxWidth: '200px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        cursor: 'pointer',
                                        display: 'block'
                                      }}
                                    >
                                      {record.catatan}
                                    </Typography>
                                  </Tooltip>
                                ) : (
                                  <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                    -
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell align="center">
                                <IconButton 
                                  color="primary" 
                                  size="small"
                                  sx={{ mr: 1 }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton 
                                  color="error" 
                                  size="small"
                                  onClick={() => handleDeleteDialogOpen(record)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {filteredRecords.length > 0 && (
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredRecords.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                )}
              </Paper>
            )}
          </Box>
        )}

        {/* Dialog konfirmasi hapus */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteDialogClose}
          PaperProps={{
            sx: { width: isMobile ? '85%' : '500px', p: isMobile ? 1 : 2, borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ pb: isMobile ? 1 : 2, fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
            Konfirmasi Hapus
          </DialogTitle>
          <DialogContent sx={{ pt: isMobile ? 1 : 2 }}>
            <Typography variant="body1" sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
              Apakah Anda yakin ingin menghapus catatan {recordToDelete?.waste_name}?
            </Typography>
            <Typography variant="body2" color="error" sx={{ mt: 2, fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
              Tindakan ini tidak dapat dibatalkan.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: isMobile ? 2 : 3, pb: isMobile ? 2 : 3 }}>
            <Button 
              onClick={handleDeleteDialogClose} 
              variant="text"
              size={isMobile ? "small" : "medium"}
              sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}
            >
              Batal
            </Button>
            <Button 
              onClick={handleDeleteRecord} 
              variant="contained" 
              color="error"
              size={isMobile ? "small" : "medium"}
              disabled={isDeleting}
              startIcon={isDeleting && <CircularProgress size={16} color="inherit" />}
              sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}
            >
              {isDeleting ? 'Menghapus...' : 'Hapus'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog panduan */}
        <Dialog
          open={openGuideDialog}
          onClose={handleCloseGuideDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 2 } }}
          fullScreen={isMobile}
        >
          <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2, fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
            Panduan Fitur Tracking Sampah
          </DialogTitle>
          <DialogContent>
            <Stepper activeStep={currentGuideStep} orientation="vertical" sx={{ mt: 2 }}>
              {updatedGuideSteps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>
                    <Typography sx={{ fontWeight: 600, fontSize: isMobile ? '0.9rem' : '1rem' }}>{step.label}</Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography sx={{ fontSize: isMobile ? '0.85rem' : '0.9rem', mb: 2 }}>
                      {step.description}
                    </Typography>
                    {step.image && (
                      <Box sx={{ mb: 2, borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                        <img src={step.image} alt={step.label} style={{ width: '100%', display: 'block' }} />
                      </Box>
                    )}
                    <Box sx={{ mb: 2, mt: 1 }}>
                      <Button
                        variant="contained"
                        onClick={() => setCurrentGuideStep(prevStep => Math.min(prevStep + 1, updatedGuideSteps.length - 1))}
                        disabled={currentGuideStep === updatedGuideSteps.length - 1}
                        size={isMobile ? "small" : "medium"}
                        sx={{ mr: 1, fontSize: isMobile ? '0.8rem' : '0.9rem' }}
                      >
                        {currentGuideStep === updatedGuideSteps.length - 1 ? 'Selesai' : 'Lanjut'}
                      </Button>
                      <Button
                        onClick={() => setCurrentGuideStep(prevStep => Math.max(prevStep - 1, 0))}
                        disabled={currentGuideStep === 0}
                        size={isMobile ? "small" : "medium"}
                        sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}
                      >
                        Kembali
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {currentGuideStep === updatedGuideSteps.length && (
              <Box sx={{ p: 3, mt: 2, textAlign: 'center' }}>
                <Typography sx={{ mb: 2, fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  Panduan selesai! Kamu telah mengetahui cara menggunakan fitur tracking sampah.
                </Typography>
                <Button onClick={handleCloseGuideDialog} variant="contained" sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                  Tutup Panduan
                </Button>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ borderTop: 1, borderColor: 'divider', p: 2 }}>
            <Button 
              onClick={handleCloseGuideDialog}
              size={isMobile ? "small" : "medium"}
              sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}
            >
              Tutup
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Tracking;
