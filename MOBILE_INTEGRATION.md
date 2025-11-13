# Mobile Integration Guide - Avatar System

## Android (Kotlin + Jetpack Compose)

### 1. Define Data Classes

```kotlin
// AvatarModels.kt
data class AvatarCustomization(
    val style: String,           // "anime", "cartoon", "pixel", "realistic"
    val bodyType: String,
    val skinTone: String,
    val hairstyle: String,
    val hairColor: String,
    val eyeStyle: String,
    val eyeColor: String,
    val clothingType: String,
    val clothingColor: String,
    val accessories: List<String> = emptyList()
)

data class Avatar(
    val _id: String,
    val userId: String,
    val name: String,
    val customization: AvatarCustomization,
    val isActive: Boolean,
    val expression: String,      // "happy", "sad", "excited", "thinking", "neutral"
    val avatarImageUrl: String?,
    val energy: Int,             // 0-100
    val experience: Int,
    val level: Int,
    val state: String,           // "idle", "playing", "celebrating", "thinking"
    val outfits: OutfitsInfo,
    val createdAt: String,
    val updatedAt: String
)

data class OutfitsInfo(
    val unlocked: List<String>,
    val equipped: String
)

data class CreateAvatarRequest(
    val name: String,
    val customization: AvatarCustomization,
    val avatarImageUrl: String? = null
)

data class UpdateAvatarRequest(
    val expression: String? = null,
    val state: String? = null,
    val energy: Int? = null,
    val equippedOutfit: String? = null
)
```

### 2. API Service

```kotlin
// AvatarApiService.kt
import retrofit2.http.*
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

interface AvatarApiService {
    
    @POST("api/avatars")
    suspend fun createAvatar(
        @Header("Authorization") token: String,
        @Body request: CreateAvatarRequest
    ): Avatar
    
    @GET("api/avatars")
    suspend fun getAllAvatars(
        @Header("Authorization") token: String
    ): List<Avatar>
    
    @GET("api/avatars/active")
    suspend fun getActiveAvatar(
        @Header("Authorization") token: String
    ): Avatar
    
    @GET("api/avatars/{avatarId}")
    suspend fun getAvatarById(
        @Header("Authorization") token: String,
        @Path("avatarId") avatarId: String
    ): Avatar
    
    @PUT("api/avatars/{avatarId}")
    suspend fun updateAvatar(
        @Header("Authorization") token: String,
        @Path("avatarId") avatarId: String,
        @Body request: UpdateAvatarRequest
    ): Avatar
    
    @POST("api/avatars/{avatarId}/activate")
    suspend fun setActiveAvatar(
        @Header("Authorization") token: String,
        @Path("avatarId") avatarId: String
    ): Avatar
    
    @DELETE("api/avatars/{avatarId}")
    suspend fun deleteAvatar(
        @Header("Authorization") token: String,
        @Path("avatarId") avatarId: String
    ): Map<String, String>
    
    @PUT("api/avatars/{avatarId}/expression")
    suspend fun updateExpression(
        @Header("Authorization") token: String,
        @Path("avatarId") avatarId: String,
        @Body request: Map<String, String>
    ): Avatar
    
    @PUT("api/avatars/{avatarId}/state")
    suspend fun updateState(
        @Header("Authorization") token: String,
        @Path("avatarId") avatarId: String,
        @Body request: Map<String, String>
    ): Avatar
    
    @PUT("api/avatars/{avatarId}/energy")
    suspend fun updateEnergy(
        @Header("Authorization") token: String,
        @Path("avatarId") avatarId: String,
        @Body request: Map<String, Int>
    ): Avatar
    
    @POST("api/avatars/{avatarId}/experience")
    suspend fun addExperience(
        @Header("Authorization") token: String,
        @Path("avatarId") avatarId: String,
        @Body request: Map<String, Int>
    ): Avatar
    
    @GET("api/avatars/{avatarId}/stats")
    suspend fun getAvatarStats(
        @Header("Authorization") token: String,
        @Path("avatarId") avatarId: String
    ): Map<String, Int>
    
    @POST("api/avatars/{avatarId}/outfits/{outfitId}/equip")
    suspend fun equipOutfit(
        @Header("Authorization") token: String,
        @Path("avatarId") avatarId: String,
        @Path("outfitId") outfitId: String
    ): Avatar
    
    @POST("api/avatars/{avatarId}/outfits/{outfitId}/unlock")
    suspend fun unlockOutfit(
        @Header("Authorization") token: String,
        @Path("avatarId") avatarId: String,
        @Path("outfitId") outfitId: String
    ): Avatar
    
    companion object {
        private const val BASE_URL = "http://10.0.2.2:3000/"  // For Android emulator
        
        fun create(token: String): AvatarApiService {
            val client = OkHttpClient.Builder()
                .addInterceptor { chain ->
                    val request = chain.request().newBuilder()
                        .addHeader("Authorization", token)
                        .build()
                    chain.proceed(request)
                }
                .build()
            
            return Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(AvatarApiService::class.java)
        }
    }
}
```

### 3. ViewModel

```kotlin
// AvatarViewModel.kt
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class AvatarViewModel(private val apiService: AvatarApiService) : ViewModel() {
    
    private val _avatars = MutableStateFlow<List<Avatar>>(emptyList())
    val avatars: StateFlow<List<Avatar>> = _avatars
    
    private val _activeAvatar = MutableStateFlow<Avatar?>(null)
    val activeAvatar: StateFlow<Avatar?> = _activeAvatar
    
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading
    
    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error
    
    fun loadAllAvatars(token: String) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                _avatars.value = apiService.getAllAvatars("Bearer $token")
                _error.value = null
            } catch (e: Exception) {
                _error.value = e.message ?: "Unknown error"
            } finally {
                _isLoading.value = false
            }
        }
    }
    
    fun loadActiveAvatar(token: String) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                _activeAvatar.value = apiService.getActiveAvatar("Bearer $token")
                _error.value = null
            } catch (e: Exception) {
                _error.value = e.message ?: "Unknown error"
            } finally {
                _isLoading.value = false
            }
        }
    }
    
    fun createAvatar(token: String, request: CreateAvatarRequest) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val newAvatar = apiService.createAvatar("Bearer $token", request)
                _avatars.value = _avatars.value + newAvatar
                _activeAvatar.value = newAvatar
                _error.value = null
            } catch (e: Exception) {
                _error.value = e.message ?: "Unknown error"
            } finally {
                _isLoading.value = false
            }
        }
    }
    
    fun updateAvatarExpression(token: String, avatarId: String, expression: String) {
        viewModelScope.launch {
            try {
                val updated = apiService.updateExpression(
                    "Bearer $token",
                    avatarId,
                    mapOf("expression" to expression)
                )
                _activeAvatar.value = updated
            } catch (e: Exception) {
                _error.value = e.message
            }
        }
    }
    
    fun updateAvatarEnergy(token: String, avatarId: String, energyDelta: Int) {
        viewModelScope.launch {
            try {
                val updated = apiService.updateEnergy(
                    "Bearer $token",
                    avatarId,
                    mapOf("energyDelta" to energyDelta)
                )
                _activeAvatar.value = updated
            } catch (e: Exception) {
                _error.value = e.message
            }
        }
    }
    
    fun addExperience(token: String, avatarId: String, xpGain: Int) {
        viewModelScope.launch {
            try {
                val updated = apiService.addExperience(
                    "Bearer $token",
                    avatarId,
                    mapOf("xpGain" to xpGain)
                )
                _activeAvatar.value = updated
            } catch (e: Exception) {
                _error.value = e.message
            }
        }
    }
}
```

### 4. UI Screen - Avatar Creation

```kotlin
// AvatarCreationScreen.kt
@Composable
fun AvatarCreationScreen(
    viewModel: AvatarViewModel,
    token: String,
    onAvatarCreated: () -> Unit
) {
    var avatarName by remember { mutableStateOf("") }
    var selectedStyle by remember { mutableStateOf("anime") }
    var selectedBodyType by remember { mutableStateOf("slim") }
    
    val isLoading by viewModel.isLoading.collectAsState()
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Text("Create Your Avatar", style = MaterialTheme.typography.headlineMedium)
        
        // Avatar Name
        TextField(
            value = avatarName,
            onValueChange = { avatarName = it },
            label = { Text("Avatar Name") },
            modifier = Modifier.fillMaxWidth()
        )
        
        // Style Selection
        Text("Choose Style:")
        Row {
            listOf("anime", "cartoon", "pixel", "realistic").forEach { style ->
                Button(
                    onClick = { selectedStyle = style },
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (selectedStyle == style) Color.Blue else Color.Gray
                    )
                ) {
                    Text(style)
                }
            }
        }
        
        // Body Type Selection
        Text("Body Type:")
        Row {
            listOf("slim", "round", "athletic").forEach { bodyType ->
                Button(
                    onClick = { selectedBodyType = bodyType },
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (selectedBodyType == bodyType) Color.Blue else Color.Gray
                    )
                ) {
                    Text(bodyType)
                }
            }
        }
        
        // Create Button
        Button(
            onClick = {
                val customization = AvatarCustomization(
                    style = selectedStyle,
                    bodyType = selectedBodyType,
                    skinTone = "light",
                    hairstyle = "long",
                    hairColor = "black",
                    eyeStyle = "big",
                    eyeColor = "blue",
                    clothingType = "casual",
                    clothingColor = "pink"
                )
                
                viewModel.createAvatar(
                    token,
                    CreateAvatarRequest(
                        name = avatarName,
                        customization = customization
                    )
                )
                onAvatarCreated()
            },
            modifier = Modifier.fillMaxWidth(),
            enabled = !isLoading && avatarName.isNotEmpty()
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(16.dp),
                    color = Color.White
                )
            } else {
                Text("Create Avatar")
            }
        }
    }
}
```

### 5. UI Screen - Gameplay

```kotlin
// AvatarGameplayScreen.kt
@Composable
fun AvatarGameplayScreen(
    viewModel: AvatarViewModel,
    avatar: Avatar,
    token: String
) {
    val currentAvatar by viewModel.activeAvatar.collectAsState()
    
    LaunchedEffect(Unit) {
        viewModel.updateAvatarEnergy(token, avatar._id, -5)  // Reduce energy
    }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Avatar Display
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .height(300.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.LightGray),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                if (!currentAvatar?.avatarImageUrl.isNullOrEmpty()) {
                    AsyncImage(
                        model = currentAvatar?.avatarImageUrl,
                        contentDescription = "Avatar",
                        modifier = Modifier.size(250.dp),
                        contentScale = ContentScale.Crop
                    )
                } else {
                    Text("Avatar Image")
                }
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Avatar Stats
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            StatCard("Level", currentAvatar?.level.toString())
            StatCard("XP", currentAvatar?.experience.toString())
            StatCard("Energy", "${currentAvatar?.energy}%")
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Expression Control
        Text("Expression: ${currentAvatar?.expression}")
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            listOf("happy", "excited", "thinking", "sad").forEach { expression ->
                Button(
                    onClick = {
                        viewModel.updateAvatarExpression(token, avatar._id, expression)
                    }
                ) {
                    Text(expression)
                }
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Complete Level Button
        Button(
            onClick = {
                viewModel.addExperience(token, avatar._id, 100)
                // Navigate to next screen
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp)
        ) {
            Text("Complete Level (+100 XP)")
        }
    }
}

@Composable
fun StatCard(title: String, value: String) {
    Card(
        modifier = Modifier
            .weight(1f)
            .padding(4.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(title, style = MaterialTheme.typography.bodySmall)
            Text(value, style = MaterialTheme.typography.bodyLarge)
        }
    }
}
```

---

## iOS (SwiftUI)

### 1. Define Models

```swift
// AvatarModels.swift
import Foundation

struct AvatarCustomization: Codable {
    let style: String
    let bodyType: String
    let skinTone: String
    let hairstyle: String
    let hairColor: String
    let eyeStyle: String
    let eyeColor: String
    let clothingType: String
    let clothingColor: String
    let accessories: [String]
}

struct Avatar: Codable, Identifiable {
    let id: String
    let userId: String
    let name: String
    let customization: AvatarCustomization
    let isActive: Bool
    let expression: String
    let avatarImageUrl: String?
    let energy: Int
    let experience: Int
    let level: Int
    let state: String
    let outfits: OutfitsInfo
    let createdAt: String
    let updatedAt: String
    
    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case userId, name, customization, isActive, expression
        case avatarImageUrl, energy, experience, level, state, outfits
        case createdAt, updatedAt
    }
}

struct OutfitsInfo: Codable {
    let unlocked: [String]
    let equipped: String
}

struct CreateAvatarRequest: Codable {
    let name: String
    let customization: AvatarCustomization
    let avatarImageUrl: String?
}
```

### 2. API Service

```swift
// AvatarAPIService.swift
import Foundation

class AvatarAPIService {
    private let baseURL = "http://localhost:3000"
    private var token: String = ""
    
    init(token: String) {
        self.token = token
    }
    
    private func makeRequest<T: Codable>(
        endpoint: String,
        method: String = "GET",
        body: Encodable? = nil
    ) async throws -> T {
        guard let url = URL(string: baseURL + endpoint) else {
            throw URLError(.badURL)
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        if let body = body {
            request.httpBody = try JSONEncoder().encode(body)
        }
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              (200...299).contains(httpResponse.statusCode) else {
            throw URLError(.badServerResponse)
        }
        
        return try JSONDecoder().decode(T.self, from: data)
    }
    
    func createAvatar(request: CreateAvatarRequest) async throws -> Avatar {
        try await makeRequest(
            endpoint: "/api/avatars",
            method: "POST",
            body: request
        )
    }
    
    func getAllAvatars() async throws -> [Avatar] {
        try await makeRequest(endpoint: "/api/avatars")
    }
    
    func getActiveAvatar() async throws -> Avatar {
        try await makeRequest(endpoint: "/api/avatars/active")
    }
    
    func getAvatarById(_ avatarId: String) async throws -> Avatar {
        try await makeRequest(endpoint: "/api/avatars/\(avatarId)")
    }
    
    func updateAvatarExpression(avatarId: String, expression: String) async throws -> Avatar {
        let body = ["expression": expression]
        return try await makeRequest(
            endpoint: "/api/avatars/\(avatarId)/expression",
            method: "PUT",
            body: body
        )
    }
    
    func updateAvatarState(avatarId: String, state: String) async throws -> Avatar {
        let body = ["state": state]
        return try await makeRequest(
            endpoint: "/api/avatars/\(avatarId)/state",
            method: "PUT",
            body: body
        )
    }
    
    func updateAvatarEnergy(avatarId: String, energyDelta: Int) async throws -> Avatar {
        let body = ["energyDelta": energyDelta]
        return try await makeRequest(
            endpoint: "/api/avatars/\(avatarId)/energy",
            method: "PUT",
            body: body
        )
    }
    
    func addExperience(avatarId: String, xpGain: Int) async throws -> Avatar {
        let body = ["xpGain": xpGain]
        return try await makeRequest(
            endpoint: "/api/avatars/\(avatarId)/experience",
            method: "POST",
            body: body
        )
    }
    
    func getAvatarStats(avatarId: String) async throws -> [String: Int] {
        try await makeRequest(endpoint: "/api/avatars/\(avatarId)/stats")
    }
}
```

### 3. ViewModel

```swift
// AvatarViewModel.swift
import SwiftUI

@MainActor
class AvatarViewModel: ObservableObject {
    @Published var avatars: [Avatar] = []
    @Published var activeAvatar: Avatar?
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private let apiService: AvatarAPIService
    
    init(token: String) {
        self.apiService = AvatarAPIService(token: token)
    }
    
    func loadAllAvatars() async {
        isLoading = true
        do {
            avatars = try await apiService.getAllAvatars()
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }
    
    func loadActiveAvatar() async {
        isLoading = true
        do {
            activeAvatar = try await apiService.getActiveAvatar()
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }
    
    func createAvatar(_ request: CreateAvatarRequest) async {
        isLoading = true
        do {
            let newAvatar = try await apiService.createAvatar(request: request)
            avatars.append(newAvatar)
            activeAvatar = newAvatar
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }
    
    func updateExpression(avatarId: String, to expression: String) async {
        do {
            activeAvatar = try await apiService.updateAvatarExpression(
                avatarId: avatarId,
                expression: expression
            )
        } catch {
            errorMessage = error.localizedDescription
        }
    }
    
    func addExperience(avatarId: String, xp: Int) async {
        do {
            activeAvatar = try await apiService.addExperience(
                avatarId: avatarId,
                xpGain: xp
            )
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
```

### 4. UI Views

```swift
// AvatarCreationView.swift
struct AvatarCreationView: View {
    @StateObject private var viewModel: AvatarViewModel
    @State private var avatarName = ""
    @State private var selectedStyle = "anime"
    @State private var selectedBodyType = "slim"
    
    var body: some View {
        NavigationStack {
            Form {
                Section("Avatar Details") {
                    TextField("Avatar Name", text: $avatarName)
                    
                    Picker("Style", selection: $selectedStyle) {
                        ForEach(["anime", "cartoon", "pixel", "realistic"], id: \.self) {
                            Text($0).tag($0)
                        }
                    }
                    
                    Picker("Body Type", selection: $selectedBodyType) {
                        ForEach(["slim", "round", "athletic"], id: \.self) {
                            Text($0).tag($0)
                        }
                    }
                }
                
                Section {
                    Button(action: createAvatar) {
                        if viewModel.isLoading {
                            ProgressView()
                        } else {
                            Text("Create Avatar")
                        }
                    }
                    .disabled(avatarName.isEmpty || viewModel.isLoading)
                }
            }
            .navigationTitle("Create Avatar")
            .alert("Error", isPresented: .constant(viewModel.errorMessage != nil)) {
                Button("OK") { viewModel.errorMessage = nil }
            } message: {
                Text(viewModel.errorMessage ?? "")
            }
        }
    }
    
    private func createAvatar() {
        let customization = AvatarCustomization(
            style: selectedStyle,
            bodyType: selectedBodyType,
            skinTone: "light",
            hairstyle: "long",
            hairColor: "black",
            eyeStyle: "big",
            eyeColor: "blue",
            clothingType: "casual",
            clothingColor: "pink",
            accessories: []
        )
        
        let request = CreateAvatarRequest(
            name: avatarName,
            customization: customization,
            avatarImageUrl: nil
        )
        
        Task {
            await viewModel.createAvatar(request)
        }
    }
}

// AvatarGameplayView.swift
struct AvatarGameplayView: View {
    @StateObject private var viewModel: AvatarViewModel
    let avatarId: String
    
    var body: some View {
        VStack {
            if let avatar = viewModel.activeAvatar {
                // Avatar Image
                if let imageUrl = avatar.avatarImageUrl, let url = URL(string: imageUrl) {
                    AsyncImage(url: url) { phase in
                        switch phase {
                        case .success(let image):
                            image
                                .resizable()
                                .scaledToFit()
                                .frame(height: 300)
                        case .loading:
                            ProgressView()
                        case .empty:
                            Color.gray
                        @unknown default:
                            Color.gray
                        }
                    }
                }
                
                // Stats
                HStack {
                    StatView(title: "Level", value: String(avatar.level))
                    StatView(title: "XP", value: String(avatar.experience))
                    StatView(title: "Energy", value: "\(avatar.energy)%")
                }
                .padding()
                
                // Expression Buttons
                VStack {
                    Text("Expression: \(avatar.expression)")
                    HStack {
                        ForEach(["happy", "excited", "thinking"], id: \.self) { expr in
                            Button(action: {
                                Task {
                                    await viewModel.updateExpression(
                                        avatarId: avatarId,
                                        to: expr
                                    )
                                }
                            }) {
                                Text(expr)
                                    .frame(maxWidth: .infinity)
                            }
                            .buttonStyle(.bordered)
                        }
                    }
                }
                .padding()
                
                // Complete Level
                Button(action: {
                    Task {
                        await viewModel.addExperience(avatarId: avatarId, xp: 100)
                    }
                }) {
                    Text("Complete Level (+100 XP)")
                        .frame(maxWidth: .infinity)
                        .padding()
                }
                .buttonStyle(.borderedProminent)
                .padding()
            }
        }
        .onAppear {
            Task {
                await viewModel.loadActiveAvatar()
            }
        }
    }
}

struct StatView: View {
    let title: String
    let value: String
    
    var body: some View {
        VStack {
            Text(title)
                .font(.caption)
            Text(value)
                .font(.headline)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(8)
    }
}
```

---

## Testing

### 1. Create Test Avatar (using Postman or Swagger)

```
POST /api/avatars
Authorization: Bearer <your_token>

{
  "name": "Luna",
  "customization": {
    "style": "anime",
    "bodyType": "slim",
    "skinTone": "light",
    "hairstyle": "long",
    "hairColor": "black",
    "eyeStyle": "big",
    "eyeColor": "blue",
    "clothingType": "casual",
    "clothingColor": "pink",
    "accessories": ["glasses"]
  }
}
```

### 2. Get Active Avatar

```
GET /api/avatars/active
Authorization: Bearer <your_token>
```

### 3. Add Experience

```
POST /api/avatars/{avatarId}/experience
Authorization: Bearer <your_token>

{
  "xpGain": 100
}
```

---

## Summary

✅ Both Android and iOS now support full avatar lifecycle  
✅ Real-time gameplay updates  
✅ Proper error handling  
✅ Type-safe networking  
✅ MVVM architecture ready  

Happy coding! 🎵
