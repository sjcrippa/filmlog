import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, ScrollView, TextInput, TouchableOpacity } from "react-native";

const baseUrl = 'https://imdb-com.p.rapidapi.com/search';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '03973d3060msh825a85d052dceadp1e0f20jsn71f61ad788c9',
			'x-rapidapi-host': 'imdb-com.p.rapidapi.com'
	}
};

export default function TabOneScreen() {
	const [data, setData] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const fetchData = async (query: string) => {
		setIsLoading(true);
		setError(null);
		try {
			console.log('Iniciando la solicitud a la API...');
			const url = `${baseUrl}?searchTerm=${encodeURIComponent(query)}`;
			const response = await fetch(url, options);
			console.log('Respuesta recibida:', response.status);
			const result = await response.json();
			console.log('Datos recibidos:', result);
			setData(result);
		} catch (error) {
			console.error('Error al obtener datos:', error);
			setError('Error al cargar los datos');
		} finally {
			setIsLoading(false);
		}
	};

	const handleSearch = () => {
		if (searchTerm.trim()) {
			fetchData(searchTerm);
		}
	};

	return (
		<SafeAreaView className="flex-1">
			<ScrollView className="flex-1 p-4">
				<Text className="text-xl font-bold mb-4">Búsqueda de Películas</Text>
				<View className="flex-row mb-4">
					<TextInput
						className="flex-1 border border-gray-300 rounded-l-md p-2"
						value={searchTerm}
						onChangeText={setSearchTerm}
						placeholder="Buscar películas..."
					/>
					<TouchableOpacity
						className="bg-blue-500 rounded-r-md p-2 justify-center"
						onPress={handleSearch}
					>
						<Text className="text-white font-bold">Buscar</Text>
					</TouchableOpacity>
				</View>
				{isLoading ? (
					<Text>Cargando datos...</Text>
				) : error ? (
					<Text className="text-red-500">{error}</Text>
				) : data ? (
					<View>
						<Text className="font-bold mb-2">Resultados de la búsqueda:</Text>
						<Text>{JSON.stringify(data, null, 2)}</Text>
					</View>
				) : (
					<Text>Ingresa un término de búsqueda y presiona Buscar</Text>
				)}
			</ScrollView>
		</SafeAreaView>
	);
}
