import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, ScrollView, TextInput, TouchableOpacity, Image } from "react-native";

const baseUrl = process.env.EXPO_PUBLIC_API_URL!;
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
	const [responseStatus, setResponseStatus] = useState<number | null>(null);

	const fetchData = async (query: string) => {
		setIsLoading(true);
		setError(null);
		setResponseStatus(null);
		try {
			console.log('Iniciando la solicitud a la API...');
			const url = `${baseUrl}?searchTerm=${encodeURIComponent(query)}`;
			const response = await fetch(url, options);
			setResponseStatus(response.status);
			console.log('Respuesta recibida:', response.status);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const result = await response.json();
			console.log('Datos recibidos:', JSON.stringify(result, null, 2));
			setData(result);
		} catch (error) {
			console.error('Error al obtener datos:', error);
			setError(`Error al cargar los datos: ${error.message}`);
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
					<View>
						<Text className="text-red-500">{error}</Text>
						<Text>Estado de la respuesta: {responseStatus}</Text>
					</View>
				) : data && data.data && data.data.mainSearch ? (
					<View>
						<Text className="font-bold mb-2">Resultados de la búsqueda:</Text>
						{data.data.mainSearch.edges.length > 0 ? (
							data.data.mainSearch.edges.map((edge: any, index: number) => {
								const item = edge.node.entity;
								return (
									<View key={index} className="mb-4 border-b border-gray-200 pb-2">
										<Text className="font-bold">{item.titleText.text}</Text>
										{item.primaryImage && (
											<Image
												source={{ uri: item.primaryImage.url }}
												className="w-full h-40 rounded-md my-2"
												resizeMode="cover"
											/>
										)}
										<Text>Año: {item.releaseYear?.year || 'No disponible'}</Text>
										<Text>Tipo: {item.__typename || 'No especificado'}</Text>
									</View>
								);
							})
						) : (
							<Text>No se encontraron resultados para esta búsqueda.</Text>
						)}
					</View>
				) : (
					<Text>Ingresa un término de búsqueda y presiona Buscar</Text>
				)}
			</ScrollView>
		</SafeAreaView>
	);
}
