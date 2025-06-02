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
import axios from 'axios';
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

// Custom hook untuk fetching data
const useAPI = () => {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('userToken');
  
  const api = axios.create({
    baseURL: '/api/v1',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
  
  const fetchWasteTypes = async () => {
    try {
      const response = await api.get('/waste-tracking/waste-types');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching waste types:', error);
      throw error;
    }
  };
  
  const fetchWasteCategories = async () => {
    try {
      const response = await api.get('/waste-categories');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching waste categories:', error);
      throw error;
    }
  };
  
  const fetchWasteValues = async () => {
    try {
      const response = await api.get('/waste-values');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching waste values:', error);
      throw error;
    }
  };
  
  const fetchUserWasteTracking = async (params = {}) => {
    try {
      const response = await api.get('/user-waste-trackings', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching user waste tracking:', error);
      throw error;
    }
  };
  
  const createWasteTracking = async (data) => {
    try {
      const response = await api.post('/user-waste-trackings', data);
      return response.data;
    } catch (error) {
      console.error('Error creating waste tracking:', error);
      throw error;
    }
  };
  
  const updateWasteTracking = async (id, data) => {
    try {
      const response = await api.put(`/user-waste-trackings/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating waste tracking:', error);
      throw error;
    }
  };
  
  const deleteWasteTracking = async (id) => {
    try {
      const response = await api.delete(`/user-waste-trackings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting waste tracking:', error);
      throw error;
    }
  };
  
  const exportWasteTracking = async (format = 'csv') => {
    try {
      const response = await api.get(`/user-waste-trackings/export/${format}`, {
        responseType: 'blob'
      });
      
      // Create a download link and trigger click
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `waste_tracking_export_${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('Error exporting waste tracking:', error);
      throw error;
    }
  };
  
  return {
    fetchWasteTypes,
    fetchWasteCategories,
    fetchWasteValues,
    fetchUserWasteTracking,
    createWasteTracking,
    updateWasteTracking,
    deleteWasteTracking,
    exportWasteTracking
  };
};

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

// Helper function to truncate text
const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// Create component for truncated cell with tooltip
const TruncatedCell = ({ text, maxLength = 20, align = "left" }) => {
  if (!text) return <Typography variant="body2" color="text.secondary" fontStyle="italic">-</Typography>;
  
  const shouldTruncate = text.length > maxLength;
  const displayText = shouldTruncate ? truncateText(text, maxLength) : text;
  
  return (
    <Tooltip title={shouldTruncate ? text : ""} arrow placement="top">
      <Typography
        variant="body2"
        sx={{
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          cursor: shouldTruncate ? 'pointer' : 'default',
          textAlign: align
        }}
      >
        {displayText}
      </Typography>
    </Tooltip>
  );
};

const Tracking = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [wasteTypeFilter, setWasteTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRangeStart, setDateRangeStart] = useState(null);
  const [dateRangeEnd, setDateRangeEnd] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // New state for actual data
  const [wasteTypes, setWasteTypes] = useState([]);
  const [wasteCategories, setWasteCategories] = useState([]);
  const [wasteValues, setWasteValues] = useState({});
  const [wasteRecords, setWasteRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [isLoading, setIsLoading] = useState({
    wasteTypes: true,
    wasteRecords: true,
    delete: false,
    edit: false,
    export: false,
    submit: false
  });
  const [error, setError] = useState(null);
  
  // Chart data state
  const [chartData, setChartData] = useState({
    pieData: [],
    timelineData: []
  });

  // Get API functions
  const api = useAPI();

  // State untuk form tambah catatan
  const [formData, setFormData] = useState({
    waste_type_id: '',
    amount: '',
    unit: 'kg',
    tracking_date: new Date(),
    management_status: 'disimpan',
    notes: '',
    photo: null
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
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [estimatedValue, setEstimatedValue] = useState(0);
  const [showWasteInfo, setShowWasteInfo] = useState(false);

  // State untuk menu opsi dan dialog konfirmasi
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogAction, setConfirmDialogAction] = useState('');

  // State for collapsible form in Pencatatan tab
  const [formExpanded, setFormExpanded] = useState(false);
  
  // Add edit mode state
  const [editMode, setEditMode] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  
  // Add state for the details dialog on mobile
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [detailsRecord, setDetailsRecord] = useState(null);
  
  // Toggle form expanded state
  const toggleFormExpanded = () => {
    setFormExpanded(prev => !prev);
  };
  
  // Fetch waste types, categories, and records on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(prev => ({ ...prev, wasteTypes: true, wasteRecords: true }));
        setError(null);
        
        // Fetch waste types
        const typesData = await api.fetchWasteTypes();
        setWasteTypes(typesData);
        
        // Fetch waste records
        const recordsData = await api.fetchUserWasteTracking();
        
        if (recordsData && recordsData.data) {
          setWasteRecords(recordsData.data);
          setFilteredRecords(recordsData.data);
          
          // Generate chart data only if we have records
          if (recordsData.data.length > 0) {
            setChartData(generateChartData(recordsData.data));
          }
        }
        
        setIsLoading(prev => ({ ...prev, wasteTypes: false, wasteRecords: false }));
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Terjadi kesalahan saat mengambil data. Silakan coba lagi.');
        setIsLoading(prev => ({ ...prev, wasteTypes: false, wasteRecords: false }));
        
        // Use dummy data if API fails in development
        if (process.env.NODE_ENV === 'development') {
          console.warn('Using dummy data since API request failed');
          setWasteTypes(dummyWasteTypes);
          setWasteRecords(dummyWasteRecords);
          setFilteredRecords(dummyWasteRecords);
          setChartData(generateChartData(dummyWasteRecords));
        }
      }
    };
    
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Filter records berdasarkan pencarian dan filter
    if (wasteRecords.length > 0) {
      const filtered = wasteRecords.filter(record => {
        const wasteType = wasteTypes.find(t => t.id === record.waste_type_id);
        const wasteName = wasteType ? wasteType.name : '';
        
        const matchesSearch = 
          wasteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (record.notes && record.notes.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesWasteType = wasteTypeFilter === '' || record.waste_type_id === parseInt(wasteTypeFilter);
        const matchesStatus = statusFilter === '' || record.management_status === statusFilter;
        
        const recordDate = new Date(record.tracking_date);
        const matchesDateStart = !dateRangeStart || recordDate >= dateRangeStart;
        const matchesDateEnd = !dateRangeEnd || recordDate <= dateRangeEnd;
        
        return matchesSearch && matchesWasteType && matchesStatus && matchesDateStart && matchesDateEnd;
      });

      setFilteredRecords(filtered);
      setChartData(generateChartData(filtered));
    }
  }, [searchQuery, wasteTypeFilter, statusFilter, dateRangeStart, dateRangeEnd, wasteRecords, wasteTypes]);

  // Modified generateChartData function to work with actual data structure
  const generateChartData = (records) => {
    // Data untuk chart kategori (pie chart)
    const categoryData = {};
    
    records.forEach(record => {
      // Find waste type
      const wasteType = wasteTypes.find(t => t.id === record.waste_type_id);
      
      if (wasteType) {
        const category = wasteType.category_name || 'Uncategorized';
        if (!categoryData[category]) {
          categoryData[category] = 0;
        }
        categoryData[category] += parseFloat(record.amount);
      }
    });

    const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

    // Data untuk chart tren waktu (line chart)
    const dateData = {};
    records.forEach(record => {
      const date = record.tracking_date.split('T')[0]; // Format YYYY-MM-DD
      if (!dateData[date]) {
        dateData[date] = 0;
      }
      dateData[date] += parseFloat(record.amount);
    });

    const timelineData = Object.entries(dateData)
      .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
      .map(([date, value]) => ({ date, value }));

    return { pieData, timelineData };
  };

  const handleTabChange = (event, newValue) => {
    // If switching to Pencatatan tab from tab 0 (Dashboard), set formExpanded to false
    if (tabValue === 0 && newValue === 1) {
      setFormExpanded(false);
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
      tracking_date: newDate
    }));
  };

  // Calculate estimated value based on selected waste type and amount
  useEffect(() => {
    if (formData.waste_type_id && formData.amount) {
      const wasteId = parseInt(formData.waste_type_id);
      const amount = parseFloat(formData.amount);
      
      if (wasteValues[wasteId] && !isNaN(amount)) {
        const estimated = wasteValues[wasteId] * amount;
        setEstimatedValue(estimated);
      } else {
        setEstimatedValue(0);
      }
    } else {
      setEstimatedValue(0);
    }
  }, [formData.waste_type_id, formData.amount, wasteValues]);

  // Function to handle edit button click
  const handleEditClick = (record) => {
    setEditingRecord(record);
    setFormData({
      waste_type_id: record.waste_type_id.toString(),
      amount: record.amount.toString(),
      unit: record.unit,
      tracking_date: new Date(record.tracking_date),
      management_status: record.management_status,
      notes: record.notes || '',
      photo: null
    });
    setEditMode(true);
    setFormExpanded(true);
    // Scroll to the form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Function untuk validasi form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.waste_type_id) {
      errors.waste_type_id = "Jenis sampah harus dipilih";
    }
    
    if (!formData.amount) {
      errors.amount = "Jumlah harus diisi";
    } else {
      const amount = parseFloat(formData.amount);
      if (amount <= 0) {
        errors.amount = "Jumlah harus lebih dari 0";
      }
      // Add validation for maximum value based on database constraints
      // Assuming DECIMAL(10,2) in database, max value is 99,999,999.99
      else if (amount > 99999999.99) {
        errors.amount = "Jumlah terlalu besar, maksimal 99,999,999.99";
      }
    }
    
    if (!formData.tracking_date) {
      errors.tracking_date = "Tanggal pencatatan harus diisi";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Function to toggle waste info display
  const toggleWasteInfo = () => {
    setShowWasteInfo(prev => !prev);
  };

  // Modified form submit handler to handle both create and update
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(prev => ({ ...prev, submit: true }));
      
      try {
        // Format data for API
        const formattedData = {
          waste_type_id: parseInt(formData.waste_type_id),
          amount: parseFloat(formData.amount),
          unit: formData.unit,
          tracking_date: formData.tracking_date.toISOString().split('T')[0],
          management_status: formData.management_status,
          notes: formData.notes,
          estimated_value: estimatedValue,
          // photo will be handled separately in a real implementation with multipart/form-data
        };
        
        let response;
        
        if (editMode && editingRecord) {
          // Update existing record
          response = await api.updateWasteTracking(editingRecord.id, formattedData);
          
          // Update the record in state
          setWasteRecords(prev => prev.map(r => 
            r.id === editingRecord.id ? response.data : r
          ));
          
          // Exit edit mode
          setEditMode(false);
          setEditingRecord(null);
        } else {
          // Create new record
          response = await api.createWasteTracking(formattedData);
          
          // Add the new record to the state
          setWasteRecords(prev => [response.data, ...prev]);
        }
        
        setIsLoading(prev => ({ ...prev, submit: false }));
        setSubmitSuccess(true);
        
        // Reset form after success
        setTimeout(() => {
          setSubmitSuccess(false);
          setFormData({
            waste_type_id: '',
            amount: '',
            unit: 'kg',
            tracking_date: new Date(),
            management_status: 'disimpan',
            notes: '',
            photo: null
          });
          setEstimatedValue(0);
        }, 3000);
        
        // Show success message
        Swal.fire({
          title: 'Berhasil!',
          text: editMode ? 'Data sampah berhasil diperbarui' : 'Data sampah berhasil disimpan',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      } catch (err) {
        console.error('Error submitting form:', err);
        setIsLoading(prev => ({ ...prev, submit: false }));
        
        // Show error message
        Swal.fire({
          title: 'Gagal!',
          text: err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data',
          icon: 'error',
          confirmButtonText: 'Tutup'
        });
      }
    }
  };

  // Menghitung total nilai estimasi dan berat total
  const totalNilai = filteredRecords.reduce((sum, record) => sum + (parseFloat(record.estimated_value) || 0), 0);
  const totalBerat = filteredRecords.reduce((sum, record) => sum + parseFloat(record.amount), 0);

  // Handler untuk dialog konfirmasi hapus
  const handleDeleteDialogOpen = (record) => {
    setSelectedRecord(record);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
    setSelectedRecord(null);
  };

  // Handler untuk menghapus record dengan API
  const handleDeleteRecord = async () => {
    if (!selectedRecord) return;
    
    setIsLoading(prev => ({ ...prev, delete: true }));
    
    try {
      // Delete from API
      await api.deleteWasteTracking(selectedRecord.id);
      
      // Remove from local state
      setWasteRecords(prev => prev.filter(r => r.id !== selectedRecord.id));
      
      setIsLoading(prev => ({ ...prev, delete: false }));
      setConfirmDialogOpen(false);
      setSelectedRecord(null);
      
      // Show success message
      Swal.fire({
        title: 'Berhasil!',
        text: 'Data sampah telah dihapus',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    } catch (err) {
      console.error('Error deleting record:', err);
      setIsLoading(prev => ({ ...prev, delete: false }));
      
      // Show error message
      Swal.fire({
        title: 'Gagal!',
        text: err.response?.data?.message || 'Terjadi kesalahan saat menghapus data',
        icon: 'error',
        confirmButtonText: 'Tutup'
      });
    }
  };

  // Handler for export data with API
  const handleExportData = async (format) => {
    setIsLoading(prev => ({ ...prev, export: true }));
    
    try {
      await api.exportWasteTracking(format);
      
      setIsLoading(prev => ({ ...prev, export: false }));
      handleConfirmDialogClose();
      
      // Success notification handled by the API function
    } catch (err) {
      console.error('Error exporting data:', err);
      setIsLoading(prev => ({ ...prev, export: false }));
      
      // Show error message
      Swal.fire({
        title: 'Gagal Ekspor!',
        text: 'Terjadi kesalahan saat mengekspor data',
        icon: 'error',
        confirmButtonText: 'Tutup'
      });
      
      handleConfirmDialogClose();
    }
  };
  
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

  // Handler untuk dialog konfirmasi
  const handleConfirmDialogOpen = (action) => {
    setConfirmDialogAction(action);
    setConfirmDialogOpen(true);
    handleMenuClose();
  };

  // Handler untuk aksi pada record
  const handleRecordAction = () => {
    if (!selectedRecord) return;

    if (confirmDialogAction === 'delete') {
      handleDeleteRecord();
    } else if (confirmDialogAction === 'edit') {
      handleEditClick(selectedRecord);
      setConfirmDialogOpen(false);
    }
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

  const cancelEditMode = () => {
    setEditMode(false);
    setEditingRecord(null);
    setFormData({
      waste_type_id: '',
      amount: '',
      unit: 'kg',
      tracking_date: new Date(),
      management_status: 'disimpan',
      notes: '',
      photo: null
    });
    setEstimatedValue(0);
  };

  // Handler to show details dialog on mobile
  const handleShowDetails = (record) => {
    setDetailsRecord(record);
    setDetailsDialogOpen(true);
  };

  // Handler to close details dialog
  const handleCloseDetails = () => {
    setDetailsDialogOpen(false);
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

            {/* Error Display */}
            {error && (
              <Alert severity="error" sx={{ mb: 4 }}>
                <AlertTitle>Error</AlertTitle>
                {error}
              </Alert>
            )}

            {/* Statistik Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                {isLoading.wasteRecords ? (
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Skeleton variant="text" sx={{ fontSize: '1.25rem', width: '60%', mb: 1 }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem', width: '80%', mb: 2 }} />
                    <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
                  </Paper>
                ) : (
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
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {isLoading.wasteRecords ? (
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Skeleton variant="text" sx={{ fontSize: '1.25rem', width: '60%', mb: 1 }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem', width: '80%', mb: 2 }} />
                    <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
                  </Paper>
                ) : (
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
                )}
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
                    {isLoading.wasteRecords ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
                        <CircularProgress color="primary" />
                      </Box>
                    ) : chartData.pieData.length > 0 ? (
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
                    {isLoading.wasteRecords ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
                        <CircularProgress color="primary" />
                      </Box>
                    ) : chartData.timelineData.length > 0 ? (
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
                  {editMode ? (
                    <>
                      <EditIcon sx={{ mr: 1, fontSize: { xs: '1rem', md: '1.5rem' } }} /> Edit Catatan Sampah
                    </>
                  ) : (
                    <>
                      <AddIcon sx={{ mr: 1, fontSize: { xs: '1rem', md: '1.5rem' } }} /> Catat Sampah Baru
                    </>
                  )}
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
                        <FormControl fullWidth error={!!formErrors.waste_type_id}>
                          <TextField
                            label="Jenis Sampah"
                            name="waste_type_id"
                            select
                            fullWidth
                            value={formData.waste_type_id}
                            onChange={handleFormChange}
                            required
                            error={!!formErrors.waste_type_id}
                            helperText={formErrors.waste_type_id}
                            InputProps={{
                              endAdornment: formData.waste_type_id && (
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
                            {wasteTypes.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.name} ({option.category_name})
                              </MenuItem>
                            ))}
                          </TextField>
                        </FormControl>
                        
                        {/* Waste Info Guide */}
                        {showWasteInfo && formData.waste_type_id && (
                          <Paper variant="outlined" sx={{ p: isMobile ? 1.5 : 2, mt: 1, bgcolor: 'rgba(0, 150, 136, 0.05)' }}>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                              Tips untuk {wasteTypes.find(w => w.id === parseInt(formData.waste_type_id))?.name}:
                            </Typography>
                            <Typography variant="body2" paragraph sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                              {wasteInfoGuide[formData.waste_type_id]?.tips || "Tidak ada tips khusus."}
                            </Typography>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                              Dampak Lingkungan:
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
                              {wasteInfoGuide[formData.waste_type_id]?.impact || "Informasi dampak tidak tersedia."}
                            </Typography>
                          </Paper>
                        )}
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          label="Jumlah"
                          name="amount"
                          type="number"
                          fullWidth
                          value={formData.amount}
                          onChange={handleFormChange}
                          required
                          error={!!formErrors.amount}
                          helperText={formErrors.amount}
                          InputProps={{
                            inputProps: { min: 0, step: 0.1 }
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          label="Satuan"
                          name="unit"
                          select
                          fullWidth
                          value={formData.unit}
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
                            value={formData.tracking_date}
                            onChange={handleDateChange}
                            format="dd/MM/yyyy"
                            slotProps={{ 
                              textField: { 
                                fullWidth: true, 
                                required: true,
                                error: !!formErrors.tracking_date,
                                helperText: formErrors.tracking_date 
                              } 
                            }}
                          />
                        </LocalizationProvider>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Status Pengelolaan"
                          name="management_status"
                          select
                          fullWidth
                          value={formData.management_status}
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
                          name="notes"
                          multiline
                          rows={3}
                          fullWidth
                          value={formData.notes}
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
                            startIcon={isLoading.submit ? <CircularProgress size={isMobile ? 16 : 20} color="inherit" /> : <SaveIcon />}
                            disabled={isLoading.submit}
                            size={isMobile ? "medium" : "large"}
                            sx={{ px: isMobile ? 2 : 3, py: isMobile ? 0.75 : 1 }}
                          >
                            {isLoading.submit ? 'Menyimpan...' : (editMode ? 'Perbarui Catatan' : 'Simpan Catatan')}
                          </Button>
                          
                          {editMode && (
                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={cancelEditMode}
                              size={isMobile ? "medium" : "large"}
                              sx={{ px: isMobile ? 2 : 3, py: isMobile ? 0.75 : 1 }}
                            >
                              Batal
                            </Button>
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
                  onClick={() => {
                    setSearchQuery('');
                    setWasteTypeFilter('');
                    setStatusFilter('');
                    setDateRangeStart(null);
                    setDateRangeEnd(null);
                  }}
                  disabled={!searchQuery && !wasteTypeFilter && !statusFilter && !dateRangeStart && !dateRangeEnd}
                  size={isMobile ? 'small' : 'medium'}
                >
                  {isMobile ? 'Reset' : 'Reset Filter'}
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
                    {wasteTypes.map((option) => (
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
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    <AlertTitle>Error</AlertTitle>
                    {error}
                  </Alert>
                )}

                {isLoading.wasteRecords ? (
                  [...Array(3)].map((_, index) => (
                    <Paper key={index} sx={{ mb: 2, p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="circular" width={24} height={24} />
                      </Box>
                      <Skeleton variant="text" width="40%" />
                      <Divider sx={{ my: 1 }} />
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Skeleton variant="text" width="80%" />
                        </Grid>
                        <Grid item xs={6}>
                          <Skeleton variant="text" width="60%" />
                        </Grid>
                        <Grid item xs={12}>
                          <Skeleton variant="text" width="100%" />
                        </Grid>
                      </Grid>
                    </Paper>
                  ))
                ) : filteredRecords.length === 0 ? (
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
                            {format(new Date(record.tracking_date), 'dd MMM yyyy')}
                          </Typography>
                          
                          <Chip
                            size="small"
                            label={getStatusConfig(record.management_status).label}
                            color={getStatusConfig(record.management_status).color}
                            sx={{ height: 24, '& .MuiChip-label': { px: 1, fontSize: '0.7rem' } }}
                          />
                        </Box>
                        
                        <Divider sx={{ my: 1 }} />
                        
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Jumlah</Typography>
                            <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.85rem' }}>{record.amount} {record.unit}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Kategori</Typography>
                            <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.85rem' }}>{record.category_name}</Typography>
                          </Grid>
                          <Grid item xs={12} sx={{ mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Nilai Estimasi</Typography>
                            <Typography variant="body1" fontWeight="bold" color="success.main" sx={{ fontSize: '0.9rem' }}>
                              Rp {record.estimated_value.toLocaleString()}
                            </Typography>
                          </Grid>
                          {record.notes && (
                            <Grid item xs={12} sx={{ mt: 0.5 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Catatan:</Typography>
                              <TruncatedCell text={record.notes} maxLength={50} />
                            </Grid>
                          )}
                        </Grid>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                          <Button
                            variant="text"
                            color="info"
                            size="small"
                            startIcon={<ViewIcon fontSize="small" />}
                            onClick={() => handleShowDetails(record)}
                            sx={{ mr: 1, fontSize: '0.75rem' }}
                          >
                            Detail
                          </Button>
                          <IconButton 
                            color="primary" 
                            size="small"
                            sx={{ mr: 1 }}
                            onClick={() => handleEditClick(record)}
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
                {error && (
                  <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {error}
                  </Alert>
                )}
                
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
                      {isLoading.wasteRecords ? (
                        [...Array(5)].map((_, index) => (
                          <TableRow key={index}>
                            <TableCell><Skeleton variant="text" /></TableCell>
                            <TableCell><Skeleton variant="text" /></TableCell>
                            <TableCell><Skeleton variant="text" /></TableCell>
                            <TableCell align="right"><Skeleton variant="text" /></TableCell>
                            <TableCell><Skeleton variant="rectangular" height={24} width={80} sx={{ borderRadius: 4 }} /></TableCell>
                            <TableCell align="right"><Skeleton variant="text" /></TableCell>
                            <TableCell><Skeleton variant="text" /></TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
                                <Skeleton variant="circular" width={24} height={24} />
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : filteredRecords.length === 0 ? (
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
                              <TableCell>{format(new Date(record.tracking_date), 'dd/MM/yyyy')}</TableCell>
                              <TableCell>{record.waste_name}</TableCell>
                              <TableCell>{record.category_name}</TableCell>
                              <TableCell align="right">
                                <TruncatedCell text={`${record.amount} ${record.unit}`} maxLength={10} align="right" />
                              </TableCell>
                              <TableCell>
                                <Chip
                                  size="small"
                                  label={getStatusConfig(record.management_status).label}
                                  color={getStatusConfig(record.management_status).color}
                                />
                              </TableCell>
                              <TableCell align="right" sx={{ fontWeight: 700, color: 'success.main' }}>
                                Rp {record.estimated_value.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <TruncatedCell text={record.notes} maxLength={30} />
                              </TableCell>
                              <TableCell align="center">
                                <IconButton 
                                  color="primary" 
                                  size="small"
                                  sx={{ mr: 1 }}
                                  onClick={() => handleEditClick(record)}
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
                
                {!isLoading.wasteRecords && filteredRecords.length > 0 && (
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
          open={confirmDialogOpen}
          onClose={handleConfirmDialogClose}
          PaperProps={{
            sx: { width: isMobile ? '85%' : '500px', p: isMobile ? 1 : 2, borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ pb: isMobile ? 1 : 2, fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
            Konfirmasi Hapus
          </DialogTitle>
          <DialogContent sx={{ pt: isMobile ? 1 : 2 }}>
            <Typography variant="body1" sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
              Apakah Anda yakin ingin menghapus catatan {selectedRecord?.waste_name}?
            </Typography>
            <Typography variant="body2" color="error" sx={{ mt: 2, fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
              Tindakan ini tidak dapat dibatalkan.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: isMobile ? 2 : 3, pb: isMobile ? 2 : 3 }}>
            <Button 
              onClick={handleConfirmDialogClose} 
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
              disabled={isLoading.delete}
              startIcon={isLoading.delete && <CircularProgress size={16} color="inherit" />}
              sx={{ fontSize: isMobile ? '0.8rem' : '0.9rem' }}
            >
              {isLoading.delete ? 'Menghapus...' : 'Hapus'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add mobile details dialog */}
        <Dialog
          open={detailsDialogOpen}
          onClose={handleCloseDetails}
          PaperProps={{
            sx: { width: '85%', p: 1, borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ pb: 1, fontSize: '1.1rem' }}>
            Detail Catatan Sampah
          </DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            {detailsRecord && (
              <>
                <Typography variant="subtitle1" color="primary.main" gutterBottom>
                  {detailsRecord.waste_name} ({detailsRecord.category_name})
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Jumlah</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {detailsRecord.amount} {detailsRecord.unit}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Tanggal</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {format(new Date(detailsRecord.tracking_date), 'dd/MM/yyyy')}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Status</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {detailsRecord.management_status}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Nilai Estimasi</Typography>
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      Rp {detailsRecord.estimated_value.toLocaleString()}
                    </Typography>
                  </Grid>
                  {detailsRecord.notes && (
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">Catatan</Typography>
                      <Typography variant="body2">
                        {detailsRecord.notes}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetails} variant="contained" size="small">
              Tutup
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
