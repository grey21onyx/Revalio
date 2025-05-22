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
} from '@mui/material';
import { 
  Search as SearchIcon,
  DateRange as DateRangeIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import Card from '../components/common/Card';
import { 
  PieChart, Pie, Cell, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
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

const Tracking = () => {
  const theme = useTheme();
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
  };

  const handleDateChange = (newDate) => {
    setFormData(prev => ({
      ...prev,
      tanggal_pencatatan: newDate
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Logika untuk menambahkan catatan baru akan diimplementasikan nanti
    console.log("Form submitted:", formData);
    // Reset form setelah submit
    setFormData({
      waste_id: '',
      jumlah: '',
      satuan: 'kg',
      tanggal_pencatatan: new Date(),
      status_pengelolaan: 'disimpan',
      catatan: '',
      foto: null
    });
  };

  // Menghitung total nilai estimasi dan berat total
  const totalNilai = filteredRecords.reduce((sum, record) => sum + record.nilai_estimasi, 0);
  const totalBerat = filteredRecords.reduce((sum, record) => sum + record.jumlah, 0);

  return (
    <Box sx={{ backgroundColor: '#f9f9f9', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ mb: { xs: 4, md: 5 } }}>
          <Typography 
            variant="h4" 
            component="h1" 
            fontWeight={800} 
            gutterBottom
            sx={{ 
              position: 'relative',
              display: 'inline-block',
              mb: 3
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
              mt: 2, 
              maxWidth: '800px',
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}
          >
            Pantau dan kelola sampah yang kamu kumpulkan untuk lingkungan yang lebih baik
          </Typography>
        </Box>

        {/* Main Content Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            variant="fullWidth"
          >
            <Tab label="Dashboard" />
            <Tab label="Catat Sampah" />
            <Tab label="Riwayat Pencatatan" />
          </Tabs>
        </Box>

        {/* Dashboard Tab */}
        {tabValue === 0 && (
          <Box>
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
                </Card>
              </Grid>
            </Grid>

            {/* Charts */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Komposisi Sampah Berdasarkan Kategori
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                    {chartData.pieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={chartData.pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {chartData.pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <Typography variant="body1" color="text.secondary">
                          Tidak ada data untuk ditampilkan
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Tren Pengumpulan Sampah
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                    {chartData.timelineData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                          data={chartData.timelineData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={(value) => format(new Date(value), 'dd/MM')}
                          />
                          <YAxis />
                          <Tooltip 
                            labelFormatter={(value) => format(new Date(value), 'dd/MM/yyyy')} 
                            formatter={(value) => [`${value} kg`, 'Jumlah']}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="value"
                            name="Jumlah (kg)"
                            stroke={theme.palette.primary.main}
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <Typography variant="body1" color="text.secondary">
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

        {/* Catat Sampah Tab */}
        {tabValue === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Catat Sampah Baru
            </Typography>
            <form onSubmit={handleFormSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Jenis Sampah"
                    name="waste_id"
                    select
                    fullWidth
                    value={formData.waste_id}
                    onChange={handleFormChange}
                    required
                  >
                    {dummyWasteTypes.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name} ({option.category_name})
                      </MenuItem>
                    ))}
                  </TextField>
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
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Tanggal Pencatatan"
                      value={formData.tanggal_pencatatan}
                      onChange={handleDateChange}
                      format="dd/MM/yyyy"
                      slotProps={{ textField: { fullWidth: true, required: true } }}
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
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    startIcon={<AddIcon />}
                    sx={{ mt: 2 }}
                  >
                    Simpan Catatan
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        )}

        {/* Riwayat Pencatatan Tab */}
        {tabValue === 2 && (
          <Box>
            {/* Filter and Search */}
            <Paper sx={{ p: isMobile ? 2 : 3, mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
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
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
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
                                <DateRangeIcon />
                              </InputAdornment>
                            )
                          }
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
                {filteredRecords
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((record) => (
                    <Card key={record.id} sx={{ mb: 2, p: 2 }}>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item xs={8}>
                          <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                            {record.waste_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {format(new Date(record.tanggal_pencatatan), 'dd MMM yyyy')}
                          </Typography>
                        </Grid>
                        <Grid item xs={4} textAlign="right">
                          <Box
                            sx={{
                              display: 'inline-block',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: '0.7rem',
                              fontWeight: 'medium',
                              bgcolor: 
                                record.status_pengelolaan === 'disimpan' ? theme.palette.info.light :
                                record.status_pengelolaan === 'dijual' ? theme.palette.success.light :
                                theme.palette.warning.light,
                              color:
                                record.status_pengelolaan === 'disimpan' ? theme.palette.info.dark :
                                record.status_pengelolaan === 'dijual' ? theme.palette.success.dark :
                                theme.palette.warning.dark,
                            }}
                          >
                            {record.status_pengelolaan}
                          </Box>
                        </Grid>
                        
                        <Grid item xs={6} sx={{ mt: 1 }}>
                          <Typography variant="body2">Jumlah:</Typography>
                          <Typography variant="body1" fontWeight="medium">{record.jumlah} {record.satuan}</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 1 }}>
                          <Typography variant="body2">Kategori:</Typography>
                          <Typography variant="body1" fontWeight="medium">{record.category_name}</Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 1 }}>
                          <Typography variant="body2">Nilai Estimasi:</Typography>
                          <Typography variant="body1" fontWeight="bold" color="success.dark">
                            Rp {record.nilai_estimasi.toLocaleString()}
                          </Typography>
                        </Grid>
                        {record.catatan && (
                          <Grid item xs={12} sx={{ mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">Catatan: {record.catatan}</Typography>
                          </Grid>
                        )}
                        <Grid item xs={12} sx={{ mt: 1.5, textAlign: 'right' }}>
                          <IconButton color="primary" size="small" sx={{ mr: 0.5 }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton color="error" size="small">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Card>
                  ))}
                {filteredRecords.length === 0 && (
                  <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ py: 3 }}>
                    Tidak ada data yang ditemukan
                  </Typography>
                )}
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredRecords.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  // Sembunyikan label jika tidak cukup ruang
                  labelRowsPerPage={isMobile ? '' : 'Rows per page:'} 
                />
              </Box>
            ) : (
              <Paper>
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
                      {filteredRecords
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{format(new Date(record.tanggal_pencatatan), 'dd/MM/yyyy')}</TableCell>
                            <TableCell>{record.waste_name}</TableCell>
                            <TableCell>{record.category_name}</TableCell>
                            <TableCell align="right">{record.jumlah} {record.satuan}</TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  display: 'inline-block',
                                  px: 1.5,
                                  py: 0.5,
                                  borderRadius: 1,
                                  fontSize: '0.75rem',
                                  fontWeight: 'medium',
                                  bgcolor: 
                                    record.status_pengelolaan === 'disimpan' ? 'info.light' :
                                    record.status_pengelolaan === 'dijual' ? 'success.light' :
                                    'warning.light',
                                  color:
                                    record.status_pengelolaan === 'disimpan' ? 'info.dark' :
                                    record.status_pengelolaan === 'dijual' ? 'success.dark' :
                                    'warning.dark',
                                }}
                              >
                                {record.status_pengelolaan}
                              </Box>
                            </TableCell>
                            <TableCell align="right">Rp {record.nilai_estimasi.toLocaleString()}</TableCell>
                            <TableCell>{record.catatan}</TableCell>
                            <TableCell align="center">
                              <IconButton color="primary" size="small">
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton color="error" size="small">
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      {filteredRecords.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} align="center">
                            Tidak ada data yang ditemukan
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredRecords.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Tracking;
