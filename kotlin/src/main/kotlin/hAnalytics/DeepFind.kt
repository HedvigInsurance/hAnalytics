typealias ResultMap = Map<String, Any?>

private val ResultMap.arrayRegex: String
    get() = "\\[[0-9]+\\]\$"

private fun ResultMap.getArrayValue(path: String): Any? {
    val rangeOfIndex: IntRange? = path.range(arrayRegex, String.CompareOptions.regularExpression)
    if (path.range(".*${arrayRegex}", String.CompareOptions.regularExpression) != null &&
            rangeOfIndex != null
    ) {
        val index: String = path[rangeOfIndex].drop(1).dropLast(1)
        val pathWithoutIndex: String = path.replacingCharacters(rangeOfIndex, "")
        val resultMap: List<Any>? = this[pathWithoutIndex] as? List<Any>
        val intIndex: Int? = index.toIntOrNull()

        if (intIndex != null && resultMap?.indices?.contains(intIndex) ?: false) {
            return resultMap?.get(intIndex)
        }
    }
    return null
}

internal fun ResultMap.deepFind(path: String): Any? {
    val splittedPath: List<String> = path.split('.')
    if (splittedPath.size > 1) {
        val firstPath: String? = splittedPath.firstOrNull()
        val range: IntRange? =
            Range(NSRange(0.utf16Offset(path), firstPath?.length?.utf16Offset(path)), path)

        if (firstPath != null && range != null) {
            val nextPath: String = path.replacingCharacters(range, "").drop(1)
            val arrayValue: Any? = getArrayValue(path = firstPath)

            if (arrayValue != null) {
                return (arrayValue as? ResultMap)?.deepFind(path = nextPath)
            }

            val resultMap: ResultMap? = this[firstPath] as? ResultMap

            return resultMap?.deepFind(path = nextPath)
        }

        return null
    }
    return getArrayValue(path = path) ?: this[path] ?: null
}

internal fun ResultMap.getValue(path: String): Any? {
    return deepFind(path = path)
}
